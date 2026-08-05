import { Response } from "express";
import { TicketUseCase } from "../../../application/ticket/ticket-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";
import { SystemEventLogger } from "../../services/system-event-logger.service";
import { SequelizeAppResponsible } from "../../model/app-responsible/app-responsible.model";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeApplication } from "../../model/application/application.model";
import { SequelizeRol } from "../../model/rol/rol.model";
import { SequelizeTicketStatusLog } from "../../model/ticket-status-log/ticket-status-log.model";
import { emailService } from "../../services/email-service.service";
import { TicketStatusLogValue } from "../../../domain/ticket-status-log/ticket-status-log.value";

export class TicketController {
    constructor(private ticketUseCase: TicketUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
        this.getMyTicketsCtrl = this.getMyTicketsCtrl.bind(this);
    }

    public async getAllCtrl(req: any, res: Response) {
        try {
            const status = req.query.status as string;
            const type = req.query.type as string;
            const app_uuid = req.query.app_uuid as string;
            
            const tickets = await this.ticketUseCase.getTickets({ status, type, app_uuid });

            const pageStr = req.query.page as string;
            const perPageStr = req.query.perPage as string;

            if (pageStr && perPageStr) {
                return res.status(200).send({
                    success: true,
                    message: 'Tickets retornados.',
                    ...paginator(tickets || [], pageStr, perPageStr)
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Tickets retornados.',
                data: tickets
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (TicketController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los tickets.',
                error: error.message,
            });
        }
    }

    public async getMyTicketsCtrl(req: any, res: Response) {
        try {
            const usr_uuid = req?.user?.sub || req?.user?.usr_uuid;
            if (!usr_uuid) {
                return res.status(401).json({
                    success: false,
                    message: 'No autorizado.',
                    error: 'Usuario no identificado.'
                });
            }

            const tickets = await this.ticketUseCase.getTickets({ usr_uuid });
            return res.status(200).send({
                success: true,
                message: 'Tus tickets retornados.',
                data: tickets
            });
        } catch (error: any) {
            console.error('Error en getMyTicketsCtrl (TicketController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar tus tickets.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: any, res: Response) {
        try {
            const tic_uuid = req.params.tic_uuid;
            const ticket = await this.ticketUseCase.findTicketById(tic_uuid);
            if (!ticket) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró el ticket.'
                });
            }
            return res.status(200).send({
                success: true,
                message: 'Ticket retornado.',
                data: ticket
            });
        } catch (error: any) {
            console.error('Error en getCtrl (TicketController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el ticket.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: any, res: Response) {
        try {
            const body = req.body;
            const usr_uuid = req?.user?.sub || req?.user?.usr_uuid || body.usr_uuid || null;

            if (!body.app_uuid || !body.tic_type || !body.tic_title || !body.tic_description) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos requeridos insuficientes.',
                    error: 'Faltan campos mandatorios para crear el ticket.'
                });
            }

            const ticket = await this.ticketUseCase.createTicket({
                usr_uuid,
                app_uuid: body.app_uuid,
                tic_type: body.tic_type,
                tic_title: body.tic_title,
                tic_description: body.tic_description,
                tic_metadata: body.tic_metadata ? (typeof body.tic_metadata === 'string' ? body.tic_metadata : JSON.stringify(body.tic_metadata)) : null,
                tic_images: body.tic_images || null
            });

            if (!ticket) {
                throw new Error('No se pudo crear el ticket.');
            }

            // Emitir evento por sockets en tiempo real
            this.socketAdapter.emitEvent('ticket_created', ticket);

            // Registrar el log de estado inicial del ticket
            try {
                const initialStatusLog = new TicketStatusLogValue({
                    tic_uuid: ticket.tic_uuid,
                    usr_uuid: usr_uuid || '', // Usuario creador
                    ticstlo_oldstatus: null,
                    ticstlo_newstatus: ticket.tic_status || 'PENDING',
                    ticstlo_admincomment: 'Reporte registrado en la plataforma.'
                });
                await SequelizeTicketStatusLog.create(initialStatusLog as any);
            } catch (logError: any) {
                console.error('Error registrando log de estado inicial:', logError.message);
            }

            // Guardar registro de auditoría
            await SystemEventLogger.log(req, 'TICKET_CREATED', 'Ticket', ticket.tic_uuid, {
                tic_title: ticket.tic_title,
                tic_type: ticket.tic_type
            });

            // 1. Obtener datos de la aplicación y el usuario creador para armar la notificación
            const app = await SequelizeApplication.findByPk(body.app_uuid);
            const reporter = usr_uuid ? await SequelizeUser.findByPk(usr_uuid) : null;
            const appName = app ? app.app_name : 'Aplicación Desconocida';
            const reporterName = reporter ? `${reporter.usr_name} ${reporter.usr_surname} (${reporter.usr_email})` : 'Usuario Anónimo';

            // 2. Buscar responsables asignados a esta aplicación
            const responsibles = await SequelizeAppResponsible.findAll({
                where: { app_uuid: body.app_uuid },
                include: [
                    { model: SequelizeUser, as: 'user', attributes: ['usr_email', 'usr_name', 'usr_surname'] },
                    { model: SequelizeRol, as: 'rol', attributes: ['rol_name'] }
                ]
            });

            // 3. Enviar correo a los responsables (o al email de soporte por defecto/sysadmins)
            let recipientEmails: string[] = [];
            if (responsibles && responsibles.length > 0) {
                recipientEmails = responsibles
                    .map((r: any) => r.user?.usr_email)
                    .filter((email: string | undefined) => !!email);
            }

            // Fallback si no hay responsables específicos de la app
            if (recipientEmails.length === 0) {
                if (process.env.SUPPORT_EMAIL) {
                    recipientEmails.push(process.env.SUPPORT_EMAIL);
                } else {
                    // Buscar a todos los administradores del sistema
                    const admins = await SequelizeUser.findAll({
                        where: { usr_sysadmin: true },
                        attributes: ['usr_email']
                    });
                    recipientEmails = admins.map(admin => admin.usr_email).filter(Boolean);
                }
            }

            // Enviar notificaciones por correo
            if (recipientEmails.length > 0) {
                const subject = `🎫 Nuevo Reporte de Soporte - ${appName}`;
                const title = `Nuevo ticket en ${appName}`;
                const contentHtml = `
                    <p>Se ha registrado un nuevo ticket de soporte en la plataforma.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p><strong>Tipo:</strong> ${body.tic_type}</p>
                    <p><strong>Título:</strong> ${body.tic_title}</p>
                    <p><strong>Descripción:</strong> ${body.tic_description}</p>
                    <p><strong>Reportado por:</strong> ${reporterName}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 14px; color: #64748b; font-style: italic;">Por favor, ingresá al Panel Central de Soporte para gestionarlo.</p>
                `;
                
                // Enviamos a todos los destinatarios de forma asíncrona
                Promise.all(
                    recipientEmails.map(email => 
                        emailService.sendEmail(email, subject, title, contentHtml).catch(err => 
                            console.error(`Error enviando email a responsable (${email}):`, err.message)
                        )
                    )
                );
            }

            return res.status(201).send({
                success: true,
                message: 'Ticket registrado con éxito.',
                data: ticket
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (TicketController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar el ticket.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: any, res: Response) {
        try {
            const tic_uuid = req.params.tic_uuid;
            const body = req.body;
            const operatorUuid = req?.user?.sub || req?.user?.usr_uuid;

            // 1. Obtener el estado actual antes de la modificación para auditar
            const ticketBefore = await this.ticketUseCase.findTicketById(tic_uuid);
            if (!ticketBefore) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró el ticket.'
                });
            }

            const oldStatus = ticketBefore.tic_status;
            const ticket = await this.ticketUseCase.updateTicket(tic_uuid, body);

            if (!ticket) {
                throw new Error('No se pudo actualizar el ticket.');
            }

            // 2. Registrar el log de auditoría si cambió el estado
            if (body.tic_status && body.tic_status !== oldStatus) {
                try {
                    const statusLog = new TicketStatusLogValue({
                        tic_uuid: tic_uuid,
                        usr_uuid: operatorUuid || ticket.usr_uuid || '', // Operador que hizo el cambio
                        ticstlo_oldstatus: oldStatus,
                        ticstlo_newstatus: ticket.tic_status || '',
                        ticstlo_admincomment: body.tic_admincomment || body.tic_AdminComment || ticket.tic_admincomment || null
                    });
                    await SequelizeTicketStatusLog.create(statusLog as any);
                } catch (logError: any) {
                    console.error('Error registrando log de cambio de estado:', logError.message);
                }

                // 3. Si el estado nuevo es RESOLVED, CLOSED o CANCELLED (anulado), notificar al usuario creador
                const targetStatus = ticket.tic_status;
                if (targetStatus === 'RESOLVED' || targetStatus === 'CLOSED' || targetStatus === 'CANCELLED') {
                    const creatorUuid = ticket.usr_uuid || undefined;
                    const creator = creatorUuid ? await SequelizeUser.findByPk(creatorUuid) : null;
                    if (creator && creator.usr_email) {
                        const appUuid = ticket.app_uuid || undefined;
                        const app = appUuid ? await SequelizeApplication.findByPk(appUuid) : null;
                        const appName = app ? app.app_name : 'ATS Suite';
                        
                        let statusText = 'Solucionado';
                        let emailTitle = '¡Tu reporte ha sido Solucionado! 🎉';
                        if (targetStatus === 'CANCELLED') {
                            statusText = 'Anulado';
                            emailTitle = 'Tu reporte ha sido Anulado';
                        } else if (targetStatus === 'CLOSED') {
                            statusText = 'Cerrado';
                            emailTitle = 'Tu reporte ha sido Cerrado';
                        }

                        const subject = `🎫 Actualización de tu Ticket - ${appName}`;
                        const resolutionComment = body.tic_admincomment || body.tic_AdminComment || 'El equipo técnico procesó tu solicitud.';
                        
                        const contentHtml = `
                            <p>Hola <strong>${creator.usr_name}</strong>,</p>
                            <p>Te escribimos para informarte que tu reporte titulado "<strong>${ticket.tic_title}</strong>" en la plataforma <strong>${appName}</strong> ha cambiado de estado a: <strong style="color: #16a34a;">${statusText}</strong>.</p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                            <p><strong>Nota técnica / Resolución del administrador:</strong></p>
                            <blockquote style="background-color: #f8fafc; border-left: 4px solid #1890ff; padding: 12px 16px; margin: 15px 0; color: #475569; font-style: italic;">
                                ${resolutionComment}
                            </blockquote>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                            <p style="font-size: 14px; color: #64748b;">Gracias por ayudarnos a mejorar ${appName}.</p>
                        `;

                        emailService.sendEmail(creator.usr_email, subject, emailTitle, contentHtml).catch(err => 
                            console.error(`Error enviando notificación de resolución a ${creator.usr_email}:`, err.message)
                        );
                    }
                }
            }

            // Emitir evento por sockets en tiempo real
            this.socketAdapter.emitEvent('ticket_updated', ticket);

            // Guardar registro de auditoría
            await SystemEventLogger.log(req, 'TICKET_UPDATED', 'Ticket', ticket.tic_uuid, {
                tic_status: ticket.tic_status,
                tic_priority: ticket.tic_priority
            });

            return res.status(200).send({
                success: true,
                message: 'Ticket actualizado con éxito.',
                data: ticket
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (TicketController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el ticket.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: any, res: Response) {
        try {
            const tic_uuid = req.params.tic_uuid;
            const ticket = await this.ticketUseCase.deleteTicket(tic_uuid);

            if (!ticket) {
                throw new Error('No se pudo eliminar el ticket.');
            }

            // Emitir evento por sockets en tiempo real
            this.socketAdapter.emitEvent('ticket_deleted', ticket);

            // Guardar registro de auditoría
            await SystemEventLogger.log(req, 'TICKET_DELETED', 'Ticket', tic_uuid, {
                tic_title: ticket.tic_title
            });

            return res.status(200).send({
                success: true,
                message: 'Ticket eliminado con éxito.',
                data: ticket
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (TicketController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el ticket.',
                error: error.message,
            });
        }
    }
}

import { Response } from "express";
import { TicketUseCase } from "../../../application/ticket/ticket-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";
import { SystemEventLogger } from "../../services/system-event-logger.service";

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

            // Guardar registro de auditoría
            await SystemEventLogger.log(req, 'TICKET_CREATED', 'Ticket', ticket.tic_uuid, {
                tic_title: ticket.tic_title,
                tic_type: ticket.tic_type
            });

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

            const ticket = await this.ticketUseCase.updateTicket(tic_uuid, body);

            if (!ticket) {
                throw new Error('No se pudo actualizar el ticket.');
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

import { TicketRepository } from "../../domain/ticket/ticket.repository";
import { TicketEntity, TicketUpdateData } from "../../domain/ticket/ticket.entity";
import { TicketValue } from "../../domain/ticket/ticket.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";
import { sequelize } from "../../infrastructure/db/sequelize";
import { SequelizeTicketStatusLog } from "../../infrastructure/model/ticket-status-log/ticket-status-log.model";
import { TicketStatusLogValue } from "../../domain/ticket-status-log/ticket-status-log.value";

export class TicketUseCase {
    constructor(
        private readonly ticketRepository: TicketRepository
    ) {
        this.getTickets = this.getTickets.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.deleteTicket = this.deleteTicket.bind(this);
        this.findTicketById = this.findTicketById.bind(this);
    }

    public async getTickets(filter?: { status?: string, type?: string, app_uuid?: string, usr_uuid?: string }) {
        try {
            const tickets = await this.ticketRepository.getTickets(filter);
            if (!tickets) {
                return [];
            }
            // Formatear las fechas en zona horaria local de Buenos Aires
            return tickets.map((t: any) => {
                const plainObj = typeof t.toJSON === 'function' ? t.toJSON() : t;
                return {
                    ...plainObj,
                    tic_createdat: TimezoneConverter.toIsoStringInTimezone(plainObj.tic_createdat, 'America/Buenos_Aires'),
                    tic_updatedat: TimezoneConverter.toIsoStringInTimezone(plainObj.tic_updatedat, 'America/Buenos_Aires')
                };
            });
        } catch (error: any) {
            console.error('Error en getTickets (use case):', error.message);
            throw error;
        }
    }

    public async findTicketById(tic_uuid: string) {
        try {
            const ticket = await this.ticketRepository.findTicketById(tic_uuid);
            if (!ticket) return null;
            const plainObj = typeof (ticket as any).toJSON === 'function' ? (ticket as any).toJSON() : ticket;
            return {
                ...plainObj,
                tic_createdat: TimezoneConverter.toIsoStringInTimezone(plainObj.tic_createdat, 'America/Buenos_Aires'),
                tic_updatedat: TimezoneConverter.toIsoStringInTimezone(plainObj.tic_updatedat, 'America/Buenos_Aires')
            };
        } catch (error: any) {
            console.error('Error en findTicketById (use case):', error.message);
            throw error;
        }
    }

    public async createTicket(data: {
        usr_uuid: string | null;
        app_uuid: string;
        tic_type: string;
        tic_title: string;
        tic_description: string;
        tic_metadata?: string | null;
        tic_images?: string[] | null;
    }) {
        const transaction = await sequelize.transaction();
        try {
            const ticketValue = new TicketValue(data);
            const ticket = await this.ticketRepository.createTicket(ticketValue, { transaction });
            
            if (!ticket) {
                throw new Error('No se pudo crear el registro de ticket.');
            }

            // Registrar el log de estado inicial del ticket
            const initialStatusLog = new TicketStatusLogValue({
                tic_uuid: ticket.tic_uuid,
                usr_uuid: data.usr_uuid || '', // Usuario creador
                ticstlo_oldstatus: null,
                ticstlo_newstatus: ticket.tic_status || 'PENDING',
                ticstlo_admincomment: 'Reporte registrado en la plataforma.'
            });
            await SequelizeTicketStatusLog.create(initialStatusLog as any, { transaction });

            await transaction.commit();
            return ticket;
        } catch (error: any) {
            await transaction.rollback();
            console.error('Error en createTicket (use case):', error.message);
            throw error;
        }
    }

    public async updateTicket(tic_uuid: string, updateData: any, operatorUuid?: string) {
        const transaction = await sequelize.transaction();
        try {
            // Obtener el estado actual antes de la modificación para auditar
            const ticketBefore = await this.ticketRepository.findTicketById(tic_uuid, { transaction });
            if (!ticketBefore) {
                throw new Error(`No se encontró el ticket con Id: ${tic_uuid}`);
            }

            const oldStatus = ticketBefore.tic_status;
            const ticket = await this.ticketRepository.updateTicket(tic_uuid, updateData, { transaction });

            if (!ticket) {
                throw new Error('No se pudo actualizar el ticket.');
            }

            // Registrar el log de cambio de estado si cambió el estado
            if (updateData.tic_status && updateData.tic_status !== oldStatus) {
                const statusLog = new TicketStatusLogValue({
                    tic_uuid: tic_uuid,
                    usr_uuid: operatorUuid || ticket.usr_uuid || '', // Operador que hizo el cambio
                    ticstlo_oldstatus: oldStatus,
                    ticstlo_newstatus: ticket.tic_status || '',
                    ticstlo_admincomment: updateData.tic_admincomment || updateData.tic_AdminComment || ticket.tic_admincomment || null
                });
                await SequelizeTicketStatusLog.create(statusLog as any, { transaction });
            }

            await transaction.commit();
            return ticket;
        } catch (error: any) {
            await transaction.rollback();
            console.error('Error en updateTicket (use case):', error.message);
            throw error;
        }
    }

    public async deleteTicket(tic_uuid: string) {
        try {
            return await this.ticketRepository.deleteTicket(tic_uuid);
        } catch (error: any) {
            console.error('Error en deleteTicket (use case):', error.message);
            throw error;
        }
    }
}

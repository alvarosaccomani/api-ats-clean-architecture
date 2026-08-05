import { TicketRepository } from "../../domain/ticket/ticket.repository";
import { TicketEntity, TicketUpdateData } from "../../domain/ticket/ticket.entity";
import { TicketValue } from "../../domain/ticket/ticket.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

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
        try {
            const ticketValue = new TicketValue(data);
            return await this.ticketRepository.createTicket(ticketValue);
        } catch (error: any) {
            console.error('Error en createTicket (use case):', error.message);
            throw error;
        }
    }

    public async updateTicket(tic_uuid: string, updateData: TicketUpdateData) {
        try {
            return await this.ticketRepository.updateTicket(tic_uuid, updateData);
        } catch (error: any) {
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

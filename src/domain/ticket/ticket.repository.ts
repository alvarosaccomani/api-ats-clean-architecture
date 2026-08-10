import { TicketEntity, TicketUpdateData } from "./ticket.entity";

export interface TicketRepository {
    createTicket(ticket: TicketEntity, options?: { transaction?: any }): Promise<TicketEntity | null>;
    getTickets(filter?: { status?: string, type?: string, app_uuid?: string, usr_uuid?: string }, options?: { transaction?: any }): Promise<TicketEntity[] | null>;
    findTicketById(tic_uuid: string, options?: { transaction?: any }): Promise<TicketEntity | null>;
    updateTicket(tic_uuid: string, updateData: TicketUpdateData, options?: { transaction?: any }): Promise<TicketEntity | null>;
    deleteTicket(tic_uuid: string, options?: { transaction?: any }): Promise<TicketEntity | null>;
}

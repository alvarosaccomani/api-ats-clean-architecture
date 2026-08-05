import { TicketEntity, TicketUpdateData } from "./ticket.entity";

export interface TicketRepository {
    createTicket(ticket: TicketEntity): Promise<TicketEntity | null>;
    getTickets(filter?: { status?: string, type?: string, app_uuid?: string, usr_uuid?: string }): Promise<TicketEntity[] | null>;
    findTicketById(tic_uuid: string): Promise<TicketEntity | null>;
    updateTicket(tic_uuid: string, updateData: TicketUpdateData): Promise<TicketEntity | null>;
    deleteTicket(tic_uuid: string): Promise<TicketEntity | null>;
}

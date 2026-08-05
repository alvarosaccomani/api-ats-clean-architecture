import { TicketEntity, TicketUpdateData } from "../../../domain/ticket/ticket.entity";
import { TicketRepository } from "../../../domain/ticket/ticket.repository";
import { SequelizeTicket } from "../../model/ticket/ticket.model";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeApplication } from "../../model/application/application.model";
import { SequelizeTicketStatusLog } from "../../model/ticket-status-log/ticket-status-log.model";

export class SequelizeTicketRepository implements TicketRepository {
    async createTicket(ticket: TicketEntity): Promise<TicketEntity | null> {
        try {
            const created = await SequelizeTicket.create(ticket as any);
            return created;
        } catch (error: any) {
            console.error('Error en createTicket:', error.message);
            throw error;
        }
    }

    async getTickets(filter?: { status?: string, type?: string, app_uuid?: string, usr_uuid?: string }): Promise<TicketEntity[] | null> {
        try {
            const whereClause: any = {};
            if (filter) {
                if (filter.status) whereClause.tic_status = filter.status;
                if (filter.type) whereClause.tic_type = filter.type;
                if (filter.app_uuid) whereClause.app_uuid = filter.app_uuid;
                if (filter.usr_uuid) whereClause.usr_uuid = filter.usr_uuid;
            }
            const tickets = await SequelizeTicket.findAll({
                where: whereClause,
                include: [
                    { model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick'] },
                    { model: SequelizeApplication, as: 'application', attributes: ['app_uuid', 'app_cod', 'app_name'] }
                ],
                order: [['tic_createdat', 'DESC']]
            });
            return tickets;
        } catch (error: any) {
            console.error('Error en getTickets:', error.message);
            throw error;
        }
    }

    async findTicketById(tic_uuid: string): Promise<TicketEntity | null> {
        try {
            const ticket = await SequelizeTicket.findOne({
                where: { tic_uuid: tic_uuid ?? null },
                include: [
                    { model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick'] },
                    { model: SequelizeApplication, as: 'application', attributes: ['app_uuid', 'app_cod', 'app_name', 'app_url'] },
                    {
                        model: SequelizeTicketStatusLog,
                        as: 'statusLogs',
                        include: [
                            { model: SequelizeUser, as: 'operator', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick'] }
                        ]
                    }
                ],
                order: [
                    [{ model: SequelizeTicketStatusLog, as: 'statusLogs' }, 'ticstlo_createdat', 'ASC']
                ]
            });
            return ticket;
        } catch (error: any) {
            console.error('Error en findTicketById:', error.message);
            throw error;
        }
    }

    async updateTicket(tic_uuid: string, updateData: TicketUpdateData): Promise<TicketEntity | null> {
        try {
            const [updatedRows] = await SequelizeTicket.update(updateData, {
                where: { tic_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar el ticket con Id: ${tic_uuid}`);
            }
            const updated = await SequelizeTicket.findByPk(tic_uuid);
            return updated;
        } catch (error: any) {
            console.error('Error en updateTicket:', error.message);
            throw error;
        }
    }

    async deleteTicket(tic_uuid: string): Promise<TicketEntity | null> {
        try {
            const ticket = await this.findTicketById(tic_uuid);
            if (!ticket) {
                throw new Error(`No se encontró el ticket con Id: ${tic_uuid}`);
            }
            await SequelizeTicket.destroy({
                where: { tic_uuid }
            });
            return ticket;
        } catch (error: any) {
            console.error('Error en deleteTicket:', error.message);
            throw error;
        }
    }
}

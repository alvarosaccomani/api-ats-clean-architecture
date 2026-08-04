import { SystemEventEntity } from "../../../domain/system-event/system-event.entity";
import { SystemEventRepository } from "../../../domain/system-event/system-event.repository";
import { SequelizeSystemEvent } from "../../model/system-event/system-event.model";
import { SequelizeUser } from "../../model/user/user.model";

export class SequelizeSystemEventRepository implements SystemEventRepository {
    async getEvents(): Promise<SystemEventEntity[] | null> {
        try {
            const events = await SequelizeSystemEvent.findAll({
                order: [['sysev_createdat', 'DESC']],
                include: [{
                    model: SequelizeUser,
                    as: 'user',
                    attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick']
                }]
            });
            return events.map(e => e.dataValues as SystemEventEntity);
        } catch (error: any) {
            console.error('Error en getEvents:', error.message);
            throw error;
        }
    }

    async createEvent(event: SystemEventEntity): Promise<SystemEventEntity | null> {
        try {
            const result = await SequelizeSystemEvent.create({
                ...event
            });
            return result ? (result.dataValues as SystemEventEntity) : null;
        } catch (error: any) {
            console.error('Error en createEvent:', error.message);
            throw error;
        }
    }
}

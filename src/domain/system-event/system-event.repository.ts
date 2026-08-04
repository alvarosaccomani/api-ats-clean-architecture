import { SystemEventEntity } from "./system-event.entity";

export interface SystemEventRepository {
    getEvents(): Promise<SystemEventEntity[] | null>;
    createEvent(event: SystemEventEntity): Promise<SystemEventEntity | null>;
}

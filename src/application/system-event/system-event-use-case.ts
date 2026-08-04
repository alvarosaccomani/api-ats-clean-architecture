import { SystemEventRepository } from "../../domain/system-event/system-event.repository";
import { SystemEventValue } from "../../domain/system-event/system-event.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class SystemEventUseCase {
    constructor(
        private readonly eventRepository: SystemEventRepository
    ) {
        this.getEvents = this.getEvents.bind(this);
        this.createEvent = this.createEvent.bind(this);
    }

    public async getEvents() {
        try {
            const events = await this.eventRepository.getEvents();
            if (!events) {
                return [];
            }
            return events.map(e => ({
                ...e,
                sysev_createdat: TimezoneConverter.toIsoStringInTimezone(e.sysev_createdat, 'America/Buenos_Aires')
            }));
        } catch (error: any) {
            console.error('Error en getEvents (use case):', error.message);
            throw error;
        }
    }

    public async createEvent(data: {
        usr_uuid: string | null;
        sysev_action: string;
        sysev_entitytype: string;
        sysev_entityuuid: string;
        sysev_details: string | null;
        sysev_ipaddress: string | null;
        sysev_useragent: string | null;
    }) {
        try {
            const eventValue = new SystemEventValue(data);
            return await this.eventRepository.createEvent(eventValue);
        } catch (error: any) {
            console.error('Error en createEvent (use case):', error.message);
            throw error;
        }
    }
}

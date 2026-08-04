import { Request } from "express";
import { SequelizeSystemEventRepository } from "../repository/system-event/sequelize-system-event.repository";
import { SystemEventUseCase } from "../../application/system-event/system-event-use-case";

const eventRepo = new SequelizeSystemEventRepository();
const eventUseCase = new SystemEventUseCase(eventRepo);

export class SystemEventLogger {
    public static async log(
        req: Request | any,
        action: string,
        entityType: string,
        entityUuid: string,
        details: any
    ) {
        try {
            // Extraer el usuario del request (soporta sub de JWT, sesión y body)
            const usr_uuid = req?.user?.sub || req?.user?.usr_uuid || req?.session?.user?.usr_uuid || req?.body?.usr_uuid || null;
            
            // Extraer IP y User Agent
            const ipAddress = (req?.headers?.['x-forwarded-for'] as string) || req?.socket?.remoteAddress || '127.0.0.1';
            const userAgent = req?.headers?.['user-agent'] || 'UNKNOWN';

            // Convertir details a string (JSON stringified)
            const detailsStr = details ? (typeof details === 'string' ? details : JSON.stringify(details)) : null;

            await eventUseCase.createEvent({
                usr_uuid,
                sysev_action: action,
                sysev_entitytype: entityType,
                sysev_entityuuid: entityUuid,
                sysev_details: detailsStr,
                sysev_ipaddress: ipAddress,
                sysev_useragent: userAgent
            });
        } catch (error: any) {
            console.error('Error al registrar SystemEventLog de auditoría:', error.message);
        }
    }
}

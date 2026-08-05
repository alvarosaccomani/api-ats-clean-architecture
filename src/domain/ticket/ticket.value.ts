import { v4 as uuid } from "uuid";
import { TicketEntity } from "./ticket.entity";

export class TicketValue implements TicketEntity {
    tic_uuid: string;
    usr_uuid: string | null;
    app_uuid: string;
    tic_type: string;
    tic_title: string;
    tic_description: string | null;
    tic_status: string | null;
    tic_priority: string | null;
    tic_metadata: string | null;
    tic_admincomment: string | null;
    tic_images: string[] | null;
    tic_createdat: Date;
    tic_updatedat: Date;

    constructor({
        usr_uuid,
        app_uuid,
        tic_type,
        tic_title,
        tic_description,
        tic_status,
        tic_priority,
        tic_metadata,
        tic_admincomment,
        tic_images
    }: {
        usr_uuid: string | null;
        app_uuid: string;
        tic_type: string;
        tic_title: string;
        tic_description?: string | null;
        tic_status?: string | null;
        tic_priority?: string | null;
        tic_metadata?: string | null;
        tic_admincomment?: string | null;
        tic_images?: string[] | null;
    }) {
        this.tic_uuid = uuid();
        this.usr_uuid = usr_uuid;
        this.app_uuid = app_uuid;
        this.tic_type = tic_type;
        this.tic_title = tic_title;
        this.tic_description = tic_description ?? null;
        this.tic_status = tic_status ?? 'PENDING';
        this.tic_priority = tic_priority ?? 'MEDIUM';
        this.tic_metadata = tic_metadata ?? null;
        this.tic_admincomment = tic_admincomment ?? null;
        this.tic_images = tic_images ?? null;
        this.tic_createdat = new Date();
        this.tic_updatedat = new Date();
    }
}

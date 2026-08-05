import { v4 as uuid } from "uuid";
import { TicketStatusLogEntity } from "./ticket-status-log.entity";

export class TicketStatusLogValue implements TicketStatusLogEntity {
    ticstlo_uuid: string;
    tic_uuid: string;
    usr_uuid: string;
    ticstlo_oldstatus: string | null;
    ticstlo_newstatus: string;
    ticstlo_admincomment: string | null;
    ticstlo_createdat: Date;

    constructor({
        tic_uuid,
        usr_uuid,
        ticstlo_oldstatus,
        ticstlo_newstatus,
        ticstlo_admincomment
    }: {
        tic_uuid: string;
        usr_uuid: string;
        ticstlo_oldstatus?: string | null;
        ticstlo_newstatus: string;
        ticstlo_admincomment?: string | null;
    }) {
        this.ticstlo_uuid = uuid();
        this.tic_uuid = tic_uuid;
        this.usr_uuid = usr_uuid;
        this.ticstlo_oldstatus = ticstlo_oldstatus ?? null;
        this.ticstlo_newstatus = ticstlo_newstatus;
        this.ticstlo_admincomment = ticstlo_admincomment ?? null;
        this.ticstlo_createdat = new Date();
    }
}

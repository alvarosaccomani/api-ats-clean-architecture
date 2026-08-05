export interface TicketStatusLogEntity {
    ticstlo_uuid: string;
    tic_uuid: string;
    usr_uuid: string;
    ticstlo_oldstatus: string | null;
    ticstlo_newstatus: string;
    ticstlo_admincomment: string | null;
    ticstlo_createdat?: Date;
}

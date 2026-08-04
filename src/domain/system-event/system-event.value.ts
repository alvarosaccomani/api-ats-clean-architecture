import { v4 as uuid } from "uuid";
import moment from "moment";
import { SystemEventEntity } from "./system-event.entity";

export class SystemEventValue implements SystemEventEntity {
    sysev_uuid: string;
    usr_uuid: string | null;
    sysev_action: string;
    sysev_entitytype: string;
    sysev_entityuuid: string;
    sysev_details: string | null;
    sysev_ipaddress: string | null;
    sysev_useragent: string | null;
    sysev_createdat: Date;

    constructor({
        sysev_uuid,
        usr_uuid,
        sysev_action,
        sysev_entitytype,
        sysev_entityuuid,
        sysev_details,
        sysev_ipaddress,
        sysev_useragent,
        sysev_createdat
    }: {
        sysev_uuid?: string;
        usr_uuid: string | null;
        sysev_action: string;
        sysev_entitytype: string;
        sysev_entityuuid: string;
        sysev_details: string | null;
        sysev_ipaddress: string | null;
        sysev_useragent: string | null;
        sysev_createdat?: Date;
    }) {
        this.sysev_uuid = sysev_uuid || uuid();
        this.usr_uuid = usr_uuid || null;
        this.sysev_action = sysev_action;
        this.sysev_entitytype = sysev_entitytype;
        this.sysev_entityuuid = sysev_entityuuid;
        this.sysev_details = sysev_details ?? null;
        this.sysev_ipaddress = sysev_ipaddress ?? null;
        this.sysev_useragent = sysev_useragent ?? null;
        this.sysev_createdat = sysev_createdat || moment().toDate();
    }
}

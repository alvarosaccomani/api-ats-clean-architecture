import { v4 as uuid } from "uuid";
import moment from 'moment';
import { UserAuthLogEntity } from "./user-auth-log.entity";

export class UserAuthLogValue implements UserAuthLogEntity {
    usr_uuid: string;
    usraulo_uuid: string;
    app_uuid: string;
    usraulo_action: string;
    usraulo_ipaddress: string;
    usraulo_useragent: string;
    usraulo_failurereason: string;
    usraulo_createdat: Date;
    
    constructor({
            usr_uuid, 
            usraulo_uuid, 
            app_uuid,
            usraulo_action,
            usraulo_ipaddress,
            usraulo_useragent,
            usraulo_failurereason,
            usraulo_createdat
        }:{ 
            usr_uuid: string,
            usraulo_uuid?: string,
            app_uuid: string,
            usraulo_action: string,
            usraulo_ipaddress: string,
            usraulo_useragent: string,
            usraulo_failurereason: string,
            usraulo_createdat?: Date,
        }) {
        this.usr_uuid = usr_uuid;
        this.usraulo_uuid = usraulo_uuid || uuid();
        this.app_uuid = app_uuid;
        this.usraulo_action = usraulo_action;
        this.usraulo_ipaddress = usraulo_ipaddress;
        this.usraulo_useragent = usraulo_useragent;
        this.usraulo_failurereason = usraulo_failurereason;
        this.usraulo_createdat = usraulo_createdat ?? moment().toDate();
    }
}
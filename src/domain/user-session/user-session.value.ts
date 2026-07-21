import { v4 as uuid } from "uuid";
import moment from 'moment';
import { UserSessionEntity } from "./user-session.entity";

export class UserSessionValue implements UserSessionEntity {
    usr_uuid: string;
    usrs_uuid: string;
    usrs_device: string;
    usrs_ipaddress: string;
    usrs_refreshtoken: string;
    usrs_createdat: Date;
    usrs_updatedat: Date;
    
    constructor({
            usr_uuid, 
            usrs_uuid, 
            usrs_device,
            usrs_ipaddress,
            usrs_refreshtoken,
            usrs_createdat,
            usrs_updatedat
        }:{ 
            usr_uuid: string,
            usrs_uuid?: string,
            usrs_device: string,
            usrs_ipaddress: string,
            usrs_refreshtoken: string,
            usrs_createdat?: Date,
            usrs_updatedat?: Date,
        }) {
        this.usr_uuid = usr_uuid;
        this.usrs_uuid = usrs_uuid || uuid();
        this.usrs_device = usrs_device;
        this.usrs_ipaddress = usrs_ipaddress;
        this.usrs_refreshtoken = usrs_refreshtoken;
        this.usrs_createdat = usrs_createdat ?? moment().toDate();
        this.usrs_updatedat = usrs_updatedat ?? moment().toDate();
    }
}
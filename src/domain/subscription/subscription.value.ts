import { v4 as uuid } from "uuid";
import moment from 'moment';
import { SubscriptionEntity } from "./subscription.entity";

export class SubscriptionValue implements SubscriptionEntity {
    pla_uuid: string;
    app_uuid: string;
    sub_uuid: string;
    sub_subscribertype: string;
    usr_uuid?: string;
    cmp_uuid?: string;
    sub_status: string;
    sub_startsat: Date;
    sub_renewsat: Date;
    sub_endsat: Date;
    sub_active: boolean;
    sub_createdat: Date;
    sub_updatedat: Date;
    
    constructor({
            pla_uuid, 
            app_uuid, 
            sub_uuid,
            sub_subscribertype,
            usr_uuid,
            cmp_uuid,
            sub_status,
            sub_startsat,
            sub_renewsat,
            sub_endsat,
            sub_active,
            sub_createdat,
            sub_updatedat
        }:{ 
            pla_uuid: string,
            app_uuid: string,
            sub_uuid?: string,
            sub_subscribertype: string,
            usr_uuid?: string,
            cmp_uuid?: string,
            sub_status: string,
            sub_startsat: Date,
            sub_renewsat: Date,
            sub_endsat: Date,
            sub_active: boolean,
            sub_createdat?: Date,
            sub_updatedat?: Date,
        }) {
        this.pla_uuid = pla_uuid;
        this.app_uuid = app_uuid;
        this.sub_uuid = sub_uuid || uuid();
        this.sub_subscribertype = sub_subscribertype;
        this.usr_uuid = usr_uuid;
        this.cmp_uuid = cmp_uuid;
        this.sub_status = sub_status;        
        this.sub_startsat = sub_startsat;
        this.sub_renewsat = sub_renewsat;
        this.sub_endsat = sub_endsat;
        this.sub_active= sub_active ?? false;
        this.sub_createdat = sub_createdat ?? moment().toDate();
        this.sub_updatedat = sub_updatedat ?? moment().toDate();
    }
}
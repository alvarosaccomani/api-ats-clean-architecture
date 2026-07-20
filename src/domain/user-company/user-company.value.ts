import { v4 as uuid } from "uuid";
import moment from 'moment';
import { UserCompanyEntity } from "./user-company.entity";

export class UserCompanyValue implements UserCompanyEntity {
    usr_uuid: string;
    cmp_uuid: string;
    usrcmp_uuid: string;
    usrcmp_role: string;
    usrcmp_active: boolean;
    usrcmp_createdat: Date;
    usrcmp_updatedat: Date;
    
    constructor({
            usr_uuid,
            cmp_uuid, 
            usrcmp_uuid, 
            usrcmp_role,
            usrcmp_active,
            usrcmp_createdat,
            usrcmp_updatedat
        }:{ 
            usr_uuid: string,
            cmp_uuid: string,
            usrcmp_uuid?: string,
            usrcmp_role: string,
            usrcmp_active: boolean,
            usrcmp_createdat?: Date,
            usrcmp_updatedat?: Date,
        }) {
        this.usr_uuid = usr_uuid
        this.cmp_uuid = cmp_uuid;
        this.usrcmp_uuid = usrcmp_uuid || uuid();
        this.usrcmp_role = usrcmp_role;
        this.usrcmp_active= usrcmp_active ?? false;
        this.usrcmp_createdat = usrcmp_createdat ?? moment().toDate();
        this.usrcmp_updatedat = usrcmp_updatedat ?? moment().toDate();
    }
}
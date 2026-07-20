import { v4 as uuid } from "uuid";
import moment from 'moment';
import { TypeApplicationEntity } from "./type-application.entity";

export class TypeApplicationValue implements TypeApplicationEntity {
    tapp_uuid: string;
    tapp_cod: string;
    tapp_name: string;
    tapp_description: string;
    tapp_bkcolor: string;
    tapp_frcolor: string;
    tapp_active: boolean;
    tapp_createdat: Date;
    tapp_updatedat: Date;
    
    constructor({
            tapp_uuid, 
            tapp_cod, 
            tapp_name,
            tapp_description,
            tapp_bkcolor,
            tapp_frcolor,
            tapp_active,
            tapp_createdat,
            tapp_updatedat
        }:{ 
            tapp_uuid?: string,
            tapp_cod: string,
            tapp_name: string,
            tapp_description: string,
            tapp_bkcolor: string,
            tapp_frcolor: string,
            tapp_active: boolean,
            tapp_createdat?: Date,
            tapp_updatedat?: Date,
        }) {
        this.tapp_uuid = tapp_uuid || uuid();
        this.tapp_cod = tapp_cod;
        this.tapp_name = tapp_name;
        this.tapp_description = tapp_description;
        this.tapp_bkcolor = tapp_bkcolor;
        this.tapp_frcolor = tapp_frcolor;
        this.tapp_active= tapp_active ?? false;
        this.tapp_createdat = tapp_createdat ?? moment().toDate();
        this.tapp_updatedat = tapp_updatedat ?? moment().toDate();
    }
}
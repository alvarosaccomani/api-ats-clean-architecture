import { v4 as uuid } from "uuid";
import moment from 'moment';
import { ApplicationEntity } from "./application.entity";

export class ApplicationValue implements ApplicationEntity {
    app_uuid: string;
    app_cod: string;
    app_name: string;
    tapp_uuid: string;
    app_description: string;
    app_dbname: string;
    app_url: string;
    app_hasaccess: boolean;
    app_active: boolean;
    app_createdat: Date;
    app_updatedat: Date;
    
    constructor({
            app_uuid, 
            app_cod, 
            app_name,
            tapp_uuid,
            app_description,
            app_dbname,
            app_url,
            app_hasaccess,
            app_active,
            app_createdat,
            app_updatedat
        }:{ 
            app_uuid?: string,
            app_cod: string,
            app_name: string,
            tapp_uuid: string,
            app_description: string,
            app_dbname: string,
            app_url: string,
            app_hasaccess: boolean,
            app_active: boolean,
            app_createdat?: Date,
            app_updatedat?: Date,
        }) {
        this.app_uuid = app_uuid || uuid();
        this.app_cod = app_cod;
        this.app_name = app_name;
        this.tapp_uuid = tapp_uuid;
        this.app_description = app_description;
        this.app_dbname = app_dbname;
        this.app_url = app_url;
        this.app_hasaccess = app_hasaccess ?? false;
        this.app_active = app_active ?? false;
        this.app_createdat = app_createdat ?? moment().toDate();
        this.app_updatedat = app_updatedat ?? moment().toDate();
    }
}
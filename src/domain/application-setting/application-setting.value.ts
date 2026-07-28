import { v4 as uuid } from "uuid";
import moment from 'moment';
import { ApplicationSettingEntity } from "./application-setting.entity";

export class ApplicationSettingValue implements ApplicationSettingEntity {
    app_uuid: string;
    apps_uuid: string;
    apps_key: string;
    apps_parameter: string;
    apps_description: string;
    apps_value: string;
    apps_datatype: string;
    apps_options: string;
    apps_group: string;
    apps_createdat: Date;
    apps_updatedat: Date
    
    constructor({
            app_uuid,
            apps_uuid,
            apps_key,    
            apps_parameter,
            apps_description,
            apps_value,
            apps_datatype,
            apps_options,
            apps_group,
            apps_createdat,
            apps_updatedat
        }:{ 
            app_uuid: string,
            apps_uuid: string,
            apps_key: string,    
            apps_parameter: string,
            apps_description: string,
            apps_value: string,
            apps_datatype: string,
            apps_options: string,
            apps_group: string,
            apps_createdat?: Date,
            apps_updatedat?: Date
        }) {
        this.app_uuid = app_uuid;
        this.apps_uuid = uuid();
        this.apps_key = apps_key;    
        this.apps_parameter = apps_parameter;
        this.apps_description = apps_description;
        this.apps_value = apps_value;
        this.apps_datatype = apps_datatype;
        this.apps_options = apps_options;
        this.apps_group = apps_group;
        this.apps_createdat = apps_createdat ?? moment().toDate();
        this.apps_updatedat = apps_updatedat ?? moment().toDate();
    }
}
import { v4 as uuid } from "uuid";
import { ApplicationMaintenanceEntity } from "./application-maintenance.entity";

export class ApplicationMaintenanceValue implements ApplicationMaintenanceEntity {
    appmaint_uuid: string;
    app_uuid: string;
    usr_uuid: string;
    appmaint_type: string;
    appmaint_title: string;
    appmaint_description: string;
    appmaint_status: string;
    appmaint_createdat: Date;

    constructor({
        app_uuid,
        usr_uuid,
        appmaint_type,
        appmaint_title,
        appmaint_description,
        appmaint_status
    }: {
        app_uuid: string;
        usr_uuid: string;
        appmaint_type: string;
        appmaint_title: string;
        appmaint_description: string;
        appmaint_status: string;
    }) {
        this.appmaint_uuid = uuid();
        this.app_uuid = app_uuid;
        this.usr_uuid = usr_uuid;
        this.appmaint_type = appmaint_type;
        this.appmaint_title = appmaint_title;
        this.appmaint_description = appmaint_description;
        this.appmaint_status = appmaint_status;
        this.appmaint_createdat = new Date();
    }
}

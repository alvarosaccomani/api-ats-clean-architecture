import { v4 as uuid } from "uuid";
import { ApplicationUpdateEntity } from "./application-update.entity";

export class ApplicationUpdateValue implements ApplicationUpdateEntity {
    appup_uuid: string;
    app_uuid: string;
    usr_uuid: string;
    appup_version: string;
    appup_description: string;
    appup_createdat: Date;

    constructor({
        app_uuid,
        usr_uuid,
        appup_version,
        appup_description
    }: {
        app_uuid: string;
        usr_uuid: string;
        appup_version: string;
        appup_description: string;
    }) {
        this.appup_uuid = uuid();
        this.app_uuid = app_uuid;
        this.usr_uuid = usr_uuid;
        this.appup_version = appup_version;
        this.appup_description = appup_description;
        this.appup_createdat = new Date();
    }
}

import { v4 as uuid } from "uuid";
import { AppResponsibleEntity } from "./application-responsible.entity";

export class AppResponsibleValue implements AppResponsibleEntity {
    appres_uuid: string;
    app_uuid: string;
    usr_uuid: string;
    rol_uuid: string;
    appres_createdat: Date;
    appres_updatedat: Date;

    constructor({
        app_uuid,
        usr_uuid,
        rol_uuid
    }: {
        app_uuid: string;
        usr_uuid: string;
        rol_uuid: string;
    }) {
        this.appres_uuid = uuid();
        this.app_uuid = app_uuid;
        this.usr_uuid = usr_uuid;
        this.rol_uuid = rol_uuid;
        this.appres_createdat = new Date();
        this.appres_updatedat = new Date();
    }
}

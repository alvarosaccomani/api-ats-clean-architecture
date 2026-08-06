import { v4 as uuid } from "uuid";
import { ApplicationBackupEntity } from "./application-backup.entity";

export class ApplicationBackupValue implements ApplicationBackupEntity {
    appbak_uuid: string;
    app_uuid: string;
    usr_uuid: string;
    appbak_filename: string;
    appbak_size: number;
    appbak_status: string;
    appbak_storagepath: string;
    appbak_createdat: Date;

    constructor({
        app_uuid,
        usr_uuid,
        appbak_filename,
        appbak_size,
        appbak_status,
        appbak_storagepath
    }: {
        app_uuid: string;
        usr_uuid: string;
        appbak_filename: string;
        appbak_size: number;
        appbak_status: string;
        appbak_storagepath: string;
    }) {
        this.appbak_uuid = uuid();
        this.app_uuid = app_uuid;
        this.usr_uuid = usr_uuid;
        this.appbak_filename = appbak_filename;
        this.appbak_size = appbak_size;
        this.appbak_status = appbak_status;
        this.appbak_storagepath = appbak_storagepath;
        this.appbak_createdat = new Date();
    }
}

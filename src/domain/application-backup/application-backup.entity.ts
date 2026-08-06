export interface ApplicationBackupEntity {
    appbak_uuid: string,
    app_uuid: string,
    usr_uuid: string,
    appbak_filename: string,
    appbak_size: number,
    appbak_status: string,
    appbak_storagepath: string,
    appbak_createdat: Date
}

//Update
export type ApplicationBackupUpdateData = Pick<ApplicationBackupEntity, 'app_uuid' | 'usr_uuid' | 'appbak_filename' | 'appbak_size' | 'appbak_status' | 'appbak_storagepath'>
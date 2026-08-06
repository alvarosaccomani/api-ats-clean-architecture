export interface ApplicationUpdateEntity {
    appup_uuid: string,
    app_uuid: string,
    usr_uuid: string,
    appup_version: string,
    appup_description: string,
    appup_createdat: Date
}

//Update
export type ApplicationUpdateUpdateData = Pick<ApplicationUpdateEntity, 'app_uuid' | 'usr_uuid' | 'appup_version' | 'appup_description'>
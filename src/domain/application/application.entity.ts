export interface ApplicationEntity {
    app_uuid: string,
    app_cod: string,
    app_name: string,
    tapp_uuid: string,
    app_description: string,
    app_dbname: string,
    app_url: string,
    app_hasaccess: boolean,
    app_active: boolean,
    app_loginmode: string,
    app_createdat: Date,
    app_updatedat: Date
}

//Update
export type ApplicationUpdateData = Pick<ApplicationEntity, 'app_cod' | 'app_name' | 'tapp_uuid' | 'app_description' | 'app_dbname' | 'app_url' | 'app_hasaccess' | 'app_active' | 'app_loginmode'>
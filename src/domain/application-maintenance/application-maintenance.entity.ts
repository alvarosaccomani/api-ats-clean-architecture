export interface ApplicationMaintenanceEntity {
    appmaint_uuid: string,
    app_uuid: string,
    usr_uuid: string,
    appmaint_type: string,
    appmaint_title: string,
    appmaint_description: string,
    appmaint_status: string,
    appmaint_createdat: Date
}

//Update
export type ApplicationMaintenanceUpdateData = Pick<ApplicationMaintenanceEntity, 'app_uuid' | 'usr_uuid' | 'appmaint_type' | 'appmaint_title' | 'appmaint_description' | 'appmaint_status'>
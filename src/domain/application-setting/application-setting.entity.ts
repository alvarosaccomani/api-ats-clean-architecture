export interface ApplicationSettingEntity {
    app_uuid: string,
    apps_uuid: string,
    apps_key: string,
    apps_parameter: string,
    apps_description: string,
    apps_value: string,
    apps_datatype: string,
    apps_options: string,
    apps_group: string,
    apps_createdat: Date,
    apps_updatedat: Date
}

//Update
export type ApplicationSettingUpdateData = Pick<ApplicationSettingEntity, 'apps_key' | 'apps_parameter' | 'apps_description' | 'apps_value' | 'apps_datatype' | 'apps_options' | 'apps_group'>;
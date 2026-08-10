import { ApplicationSettingEntity, ApplicationSettingUpdateData } from "./application-setting.entity";

export interface ApplicationSettingRepository {
    getCompaniesSettings(app_uuid: string, options?: { transaction?: any }): Promise<ApplicationSettingEntity[] | null>;
    findApplicationSettingById(app_uuid: string, apps_uuid: string, options?: { transaction?: any }): Promise<ApplicationSettingEntity | null>;
    createApplicationSetting(applicationSetting: ApplicationSettingEntity, options?: { transaction?: any }): Promise<ApplicationSettingEntity | null>;
    updateApplicationSetting(app_uuid: string, apps_uuid: string, applicationSetting: ApplicationSettingUpdateData, options?: { transaction?: any }): Promise<ApplicationSettingEntity | null>;
    deleteApplicationSetting(app_uuid: string, apps_uuid: string, options?: { transaction?: any }): Promise<ApplicationSettingEntity | null>;
    findApplicationSettingByKey(app_uuid: string, apps_key: string, excludeUuid?: string | null, options?: { transaction?: any }): Promise<ApplicationSettingEntity | null>;
}
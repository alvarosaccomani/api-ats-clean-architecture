import { ApplicationSettingEntity, ApplicationSettingUpdateData } from "./application-setting.entity";

export interface ApplicationSettingRepository {
    getCompaniesSettings(app_uuid: string): Promise<ApplicationSettingEntity[] | null>;
    findApplicationSettingById(app_uuid: string, apps_uuid: string): Promise<ApplicationSettingEntity | null>;
    createApplicationSetting(applicationSetting: ApplicationSettingEntity): Promise<ApplicationSettingEntity | null>;
    updateApplicationSetting(app_uuid: string, apps_uuid: string, applicationSetting: ApplicationSettingUpdateData): Promise<ApplicationSettingEntity | null>;
    deleteApplicationSetting(app_uuid: string, apps_uuid: string): Promise<ApplicationSettingEntity | null>;
    findApplicationSettingByKey(app_uuid: string, apps_key: string, excludeUuid?: string | null): Promise<ApplicationSettingEntity | null>;
}
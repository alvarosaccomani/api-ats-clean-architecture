import { ApplicationSettingRepository } from "../../domain/application-setting/application-setting.repository";
import { ApplicationSettingEntity, ApplicationSettingUpdateData } from "../../domain/application-setting/application-setting.entity";

export class ApplicationSettingUseCase {
    constructor(
        private readonly settingRepository: ApplicationSettingRepository
    ) {
        this.getSettings = this.getSettings.bind(this);
        this.createSetting = this.createSetting.bind(this);
        this.updateSetting = this.updateSetting.bind(this);
        this.deleteSetting = this.deleteSetting.bind(this);
    }

    public async getSettings(app_uuid: string) {
        try {
            return await this.settingRepository.getCompaniesSettings(app_uuid);
        } catch (error: any) {
            console.error('Error en getSettings (use case):', error.message);
            throw error;
        }
    }

    public async createSetting(setting: ApplicationSettingEntity) {
        try {
            const exist = await this.settingRepository.findApplicationSettingByKey(setting.app_uuid, setting.apps_key);
            if (exist) {
                throw new Error(`Ya existe una configuración con la clave ${setting.apps_key} para esta aplicación.`);
            }
            return await this.settingRepository.createApplicationSetting(setting);
        } catch (error: any) {
            console.error('Error en createSetting (use case):', error.message);
            throw error;
        }
    }

    public async updateSetting(app_uuid: string, apps_uuid: string, setting: ApplicationSettingUpdateData) {
        try {
            const exist = await this.settingRepository.findApplicationSettingByKey(app_uuid, setting.apps_key, apps_uuid);
            if (exist) {
                throw new Error(`Ya existe otra configuración con la clave ${setting.apps_key} para esta aplicación.`);
            }
            return await this.settingRepository.updateApplicationSetting(app_uuid, apps_uuid, setting);
        } catch (error: any) {
            console.error('Error en updateSetting (use case):', error.message);
            throw error;
        }
    }

    public async deleteSetting(app_uuid: string, apps_uuid: string) {
        try {
            return await this.settingRepository.deleteApplicationSetting(app_uuid, apps_uuid);
        } catch (error: any) {
            console.error('Error en deleteSetting (use case):', error.message);
            throw error;
        }
    }
}

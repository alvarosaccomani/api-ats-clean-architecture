import { ApplicationSettingRepository } from "../../domain/application-setting/application-setting.repository";
import { ApplicationSettingEntity, ApplicationSettingUpdateData } from "../../domain/application-setting/application-setting.entity";
import { sequelize } from "../../infrastructure/db/sequelize";
import { ApplicationSettingValue } from "../../domain/application-setting/application-setting.value";

export class ApplicationSettingUseCase {
    constructor(
        private readonly settingRepository: ApplicationSettingRepository
    ) {
        this.getSettings = this.getSettings.bind(this);
        this.createSetting = this.createSetting.bind(this);
        this.updateSetting = this.updateSetting.bind(this);
        this.deleteSetting = this.deleteSetting.bind(this);
        this.adjustSettings = this.adjustSettings.bind(this);
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

    public async adjustSettings(app_uuid: string, settingsData: any[]) {
        const transaction = await sequelize.transaction();
        try {
            // A) Consultar los detalles existentes en la base de datos para ese ID maestro (app_uuid).
            const existingSettings = await this.settingRepository.getCompaniesSettings(app_uuid, { transaction }) || [];

            // B) Comparar los IDs existentes contra los IDs de los detalles recibidos en el payload.
            const payloadUuids = settingsData.map(s => s.apps_uuid).filter(Boolean);
            const orphanedSettings = existingSettings.filter(s => !payloadUuids.includes(s.apps_uuid));

            // C) Eliminar físicamente aquellos detalles que existían en base de datos pero ya no figuran en el payload.
            for (const orphan of orphanedSettings) {
                await this.settingRepository.deleteApplicationSetting(app_uuid, orphan.apps_uuid, { transaction });
            }

            // D) Crear o actualizar los registros enviados en el payload.
            const savedSettings = [];
            for (const data of settingsData) {
                const isNew = !data.apps_uuid || data.apps_uuid.length < 5;
                if (isNew) {
                    // Validar clave única antes de crear
                    const exist = await this.settingRepository.findApplicationSettingByKey(app_uuid, data.apps_key, null, { transaction });
                    if (exist) {
                        throw new Error(`Ya existe una configuración con la clave ${data.apps_key} para esta aplicación.`);
                    }

                    const val = new ApplicationSettingValue({
                        app_uuid,
                        apps_uuid: '',
                        apps_key: data.apps_key,
                        apps_parameter: data.apps_parameter,
                        apps_description: data.apps_description,
                        apps_value: data.apps_value,
                        apps_datatype: data.apps_datatype,
                        apps_options: data.apps_options,
                        apps_group: data.apps_group
                    });
                    const created = await this.settingRepository.createApplicationSetting(val, { transaction });
                    if (created) savedSettings.push(created);
                } else {
                    // Validar clave única antes de actualizar (excluyendo el registro actual)
                    const exist = await this.settingRepository.findApplicationSettingByKey(app_uuid, data.apps_key, data.apps_uuid, { transaction });
                    if (exist) {
                        throw new Error(`Ya existe otra configuración con la clave ${data.apps_key} para esta aplicación.`);
                    }

                    const updateData: ApplicationSettingUpdateData = {
                        apps_key: data.apps_key,
                        apps_parameter: data.apps_parameter,
                        apps_description: data.apps_description,
                        apps_value: data.apps_value,
                        apps_datatype: data.apps_datatype,
                        apps_options: data.apps_options,
                        apps_group: data.apps_group
                    };
                    const updated = await this.settingRepository.updateApplicationSetting(app_uuid, data.apps_uuid, updateData, { transaction });
                    if (updated) savedSettings.push(updated);
                }
            }

            // Si todo fue exitoso, confirmamos la transacción
            await transaction.commit();
            return savedSettings;
        } catch (error: any) {
            // Rollback en caso de cualquier error intermedio
            await transaction.rollback();
            console.error('Error en adjustSettings (use case):', error.message);
            throw error;
        }
    }
}

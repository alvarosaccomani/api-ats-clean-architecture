import { ApplicationSettingEntity, ApplicationSettingUpdateData } from "../../../domain/application-setting/application-setting.entity";
import { ApplicationSettingRepository } from "../../../domain/application-setting/application-setting.repository";
import { SequelizeApplicationSetting } from "../../model/application-setting/application-setting.model";
import { Op } from "sequelize";

export class SequelizeApplicationSettingRepository implements ApplicationSettingRepository {
    async getCompaniesSettings(app_uuid: string): Promise<ApplicationSettingEntity[] | null> {
        try {
            const settings = await SequelizeApplicationSetting.findAll({
                where: { app_uuid }
            });
            return settings.map(s => s.dataValues as ApplicationSettingEntity);
        } catch (error: any) {
            console.error('Error en getCompaniesSettings:', error.message);
            throw error;
        }
    }

    async findApplicationSettingById(app_uuid: string, apps_uuid: string): Promise<ApplicationSettingEntity | null> {
        try {
            const setting = await SequelizeApplicationSetting.findOne({
                where: { app_uuid, apps_uuid }
            });
            return setting ? (setting.dataValues as ApplicationSettingEntity) : null;
        } catch (error: any) {
            console.error('Error en findApplicationSettingById:', error.message);
            throw error;
        }
    }

    async createApplicationSetting(applicationSetting: ApplicationSettingEntity): Promise<ApplicationSettingEntity | null> {
        try {
            const result = await SequelizeApplicationSetting.create({
                ...applicationSetting
            });
            return result ? (result.dataValues as ApplicationSettingEntity) : null;
        } catch (error: any) {
            console.error('Error en createApplicationSetting:', error.message);
            throw error;
        }
    }

    async updateApplicationSetting(app_uuid: string, apps_uuid: string, applicationSetting: ApplicationSettingUpdateData): Promise<ApplicationSettingEntity | null> {
        try {
            const [rowsUpdated] = await SequelizeApplicationSetting.update(
                { ...applicationSetting },
                { where: { app_uuid, apps_uuid } }
            );

            if (rowsUpdated > 0) {
                return this.findApplicationSettingById(app_uuid, apps_uuid);
            }
            return null;
        } catch (error: any) {
            console.error('Error en updateApplicationSetting:', error.message);
            throw error;
        }
    }

    async deleteApplicationSetting(app_uuid: string, apps_uuid: string): Promise<ApplicationSettingEntity | null> {
        try {
            const setting = await this.findApplicationSettingById(app_uuid, apps_uuid);
            if (setting) {
                await SequelizeApplicationSetting.destroy({
                    where: { app_uuid, apps_uuid }
                });
                return setting;
            }
            return null;
        } catch (error: any) {
            console.error('Error en deleteApplicationSetting:', error.message);
            throw error;
        }
    }

    async findApplicationSettingByKey(app_uuid: string, apps_key: string, excludeUuid?: string | null): Promise<ApplicationSettingEntity | null> {
        try {
            const whereClause: any = {
                app_uuid,
                apps_key
            };

            if (excludeUuid) {
                whereClause.apps_uuid = { [Op.ne]: excludeUuid };
            }

            const setting = await SequelizeApplicationSetting.findOne({
                where: whereClause
            });
            return setting ? (setting.dataValues as ApplicationSettingEntity) : null;
        } catch (error: any) {
            console.error('Error en findApplicationSettingByKey:', error.message);
            throw error;
        }
    }
}

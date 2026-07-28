import { Request, Response } from "express";
import { ApplicationSettingUseCase } from "../../../application/application-setting/application-setting-use-case";
import { ApplicationSettingValue } from "../../../domain/application-setting/application-setting.value";

export class ApplicationSettingController {
    constructor(
        private readonly settingUseCase: ApplicationSettingUseCase
    ) {
        this.getSettingsByAppCtrl = this.getSettingsByAppCtrl.bind(this);
        this.saveSettingCtrl = this.saveSettingCtrl.bind(this);
        this.updateSettingCtrl = this.updateSettingCtrl.bind(this);
        this.deleteSettingCtrl = this.deleteSettingCtrl.bind(this);
    }

    public async getSettingsByAppCtrl(req: Request, res: Response) {
        try {
            const { app_uuid } = req.params;
            const settings = await this.settingUseCase.getSettings(app_uuid);
            return res.status(200).json({
                success: true,
                data: settings
            });
        } catch (error: any) {
            console.error('Error en getSettingsByAppCtrl (controller):', error.message);
            return res.status(500).json({
                success: false,
                message: 'Ocurrió un error al intentar obtener las configuraciones.',
                error: error.message
            });
        }
    }

    public async saveSettingCtrl(req: Request, res: Response) {
        try {
            const { app_uuid } = req.params;
            const { apps_key, apps_parameter, apps_description, apps_value, apps_datatype, apps_options, apps_group } = req.body;

            const value = new ApplicationSettingValue({
                app_uuid,
                apps_uuid: '', 
                apps_key,
                apps_parameter,
                apps_description,
                apps_value,
                apps_datatype,
                apps_options,
                apps_group
            });

            const setting = await this.settingUseCase.createSetting(value);
            return res.status(201).json({
                success: true,
                message: 'Configuración guardada correctamente.',
                data: setting
            });
        } catch (error: any) {
            console.error('Error en saveSettingCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo guardar la configuración.',
                error: error.message
            });
        }
    }

    public async updateSettingCtrl(req: Request, res: Response) {
        try {
            const { app_uuid, apps_uuid } = req.params;
            const body = req.body;

            const setting = await this.settingUseCase.updateSetting(app_uuid, apps_uuid, body);
            if (!setting) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró el registro para actualizar.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Configuración actualizada correctamente.',
                data: setting
            });
        } catch (error: any) {
            console.error('Error en updateSettingCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la configuración.',
                error: error.message
            });
        }
    }

    public async deleteSettingCtrl(req: Request, res: Response) {
        try {
            const { app_uuid, apps_uuid } = req.params;
            const setting = await this.settingUseCase.deleteSetting(app_uuid, apps_uuid);
            if (!setting) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró el registro para eliminar.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Configuración eliminada correctamente.',
                data: setting
            });
        } catch (error: any) {
            console.error('Error en deleteSettingCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la configuración.',
                error: error.message
            });
        }
    }
}

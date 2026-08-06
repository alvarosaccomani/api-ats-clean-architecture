import { Request, Response } from "express";
import { ApplicationUpdateUseCase } from "../../../application/application-update/application-update-use-case";
import { ApplicationUpdateValue } from "../../../domain/application-update/application-update.value";

export class AppUpdateController {
    constructor(private readonly updateUseCase: ApplicationUpdateUseCase) {}

    public getUpdatesCtrl = async (req: Request, res: Response) => {
        try {
            const { app_uuid } = req.params;
            const updates = await this.updateUseCase.getUpdates(app_uuid);

            return res.status(200).json({
                success: true,
                message: 'Actualizaciones recuperadas con éxito.',
                data: updates
            });
        } catch (error: any) {
            console.error('Error en getUpdatesCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las actualizaciones.',
                error: error.message
            });
        }
    }

    public createUpdateCtrl = async (req: any, res: Response) => {
        try {
            const { app_uuid } = req.params;
            const { appup_version, appup_description } = req.body;
            const usr_uuid = req.user?.sub || req.user?.usr_uuid;

            if (!appup_version || !appup_description) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos obligatorios.',
                    error: 'Se requiere versión y descripción.'
                });
            }

            const updateValue = new ApplicationUpdateValue({
                app_uuid,
                usr_uuid,
                appup_version,
                appup_description
            });

            const created = await this.updateUseCase.registerUpdate(updateValue);

            return res.status(201).json({
                success: true,
                message: 'Actualización registrada con éxito.',
                data: created
            });
        } catch (error: any) {
            console.error('Error en createUpdateCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la actualización.',
                error: error.message
            });
        }
    }
}

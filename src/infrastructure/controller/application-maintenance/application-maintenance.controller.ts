import { Request, Response } from "express";
import { ApplicationMaintenanceUseCase } from "../../../application/application-maintenance/application-maintenance-use-case";
import { ApplicationMaintenanceValue } from "../../../domain/application-maintenance/application-maintenance.value";

export class AppMaintenanceController {
    constructor(private readonly maintenanceUseCase: ApplicationMaintenanceUseCase) {}

    public getMaintenancesCtrl = async (req: Request, res: Response) => {
        try {
            const { app_uuid } = req.params;
            const maintenances = await this.maintenanceUseCase.getMaintenances(app_uuid);

            return res.status(200).json({
                success: true,
                message: 'Tareas de mantenimiento recuperadas con éxito.',
                data: maintenances
            });
        } catch (error: any) {
            console.error('Error en getMaintenancesCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las tareas de mantenimiento.',
                error: error.message
            });
        }
    }

    public createMaintenanceCtrl = async (req: any, res: Response) => {
        try {
            const { app_uuid } = req.params;
            const { appmaint_type, appmaint_title, appmaint_description, appmaint_status } = req.body;
            const usr_uuid = req.user?.sub || req.user?.usr_uuid;

            if (!appmaint_type || !appmaint_title || !appmaint_description || !appmaint_status) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos obligatorios.',
                    error: 'Se requiere tipo, título, descripción y estado.'
                });
            }

            const maintValue = new ApplicationMaintenanceValue({
                app_uuid,
                usr_uuid,
                appmaint_type,
                appmaint_title,
                appmaint_description,
                appmaint_status
            });

            const created = await this.maintenanceUseCase.registerMaintenance(maintValue);

            return res.status(201).json({
                success: true,
                message: 'Tarea de mantenimiento registrada con éxito.',
                data: created
            });
        } catch (error: any) {
            console.error('Error en createMaintenanceCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la tarea de mantenimiento.',
                error: error.message
            });
        }
    }
}

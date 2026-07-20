import { Request, Response } from "express";
import { ApplicationUseCase } from "../../../application/application/application-use-case";

export class ApplicationController {
    constructor(private applicationUseCase: ApplicationUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const applications = await this.applicationUseCase.getApplications();
            return res.status(200).send({
                success: true,
                message: 'Aplicaciones retornadas.',
                data: applications
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (ApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las aplicaciones.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const app_uuid = req.params.app_uuid;
            if (!app_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la aplicación.',
                    error: 'Debe proporcionar un Id de aplicación.'
                });
            }
            const application = await this.applicationUseCase.getDetailApplication(app_uuid);
            return res.status(200).send({
                success: true,
                message: 'Aplicación retornada.',
                data: application
            });
        } catch (error: any) {
            console.error('Error en getCtrl (ApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la aplicación.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { app_cod, app_name } = req.body;
            if (!app_cod || !app_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar la aplicación.',
                    error: 'Debe proporcionar el Código (app_cod) y Nombre (app_name).'
                });
            }
            const application = await this.applicationUseCase.saveApplication(req.body);
            return res.status(200).json({
                success: true,
                message: 'Aplicación registrada.',
                data: application
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (ApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la aplicación.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const app_uuid = req.params.app_uuid;
            const update = req.body;
            if (!app_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la aplicación.',
                    error: 'Debe proporcionar un Id de aplicación.'
                });
            }
            const application = await this.applicationUseCase.updateApplication(app_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Aplicación actualizada.',
                data: application
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (ApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la aplicación.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const app_uuid = req.params.app_uuid;
            if (!app_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la aplicación.',
                    error: 'Debe proporcionar un Id de aplicación.'
                });
            }
            const application = await this.applicationUseCase.deleteApplication(app_uuid);
            return res.status(200).json({
                success: true,
                message: 'Aplicación eliminada.',
                data: application
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (ApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la aplicación.',
                error: error.message,
            });
        }
    }
}

import { Request, Response } from "express";
import { TypeApplicationUseCase } from "../../../application/type-application/type-application-use-case";

export class TypeApplicationController {
    constructor(private typeApplicationUseCase: TypeApplicationUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const typeApplications = await this.typeApplicationUseCase.getTypeApplications();
            return res.status(200).send({
                success: true,
                message: 'Tipos de aplicaciones retornados.',
                data: typeApplications
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (TypeApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los tipos de aplicaciones.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const tapp_uuid = req.params.tapp_uuid;
            if (!tapp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el tipo de aplicación.',
                    error: 'Debe proporcionar un Id de tipo de aplicación.'
                });
            }
            const typeApplication = await this.typeApplicationUseCase.getDetailTypeApplication(tapp_uuid);
            return res.status(200).send({
                success: true,
                message: 'Tipo de aplicación retornado.',
                data: typeApplication
            });
        } catch (error: any) {
            console.error('Error en getCtrl (TypeApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el tipo de aplicación.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { tapp_cod, tapp_name } = req.body;
            if (!tapp_cod || !tapp_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar el tipo de aplicación.',
                    error: 'Debe proporcionar el Código (tapp_cod) y Nombre (tapp_name).'
                });
            }
            const typeApplication = await this.typeApplicationUseCase.saveTypeApplication(req.body);
            return res.status(200).json({
                success: true,
                message: 'Tipo de aplicación registrado.',
                data: typeApplication
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (TypeApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar el tipo de aplicación.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const tapp_uuid = req.params.tapp_uuid;
            const update = req.body;
            if (!tapp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el tipo de aplicación.',
                    error: 'Debe proporcionar un Id de tipo de aplicación.'
                });
            }
            const typeApplication = await this.typeApplicationUseCase.updateTypeApplication(tapp_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Tipo de aplicación actualizado.',
                data: typeApplication
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (TypeApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el tipo de aplicación.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const tapp_uuid = req.params.tapp_uuid;
            if (!tapp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el tipo de aplicación.',
                    error: 'Debe proporcionar un Id de tipo de aplicación.'
                });
            }
            const typeApplication = await this.typeApplicationUseCase.deleteTypeApplication(tapp_uuid);
            return res.status(200).json({
                success: true,
                message: 'Tipo de aplicación eliminado.',
                data: typeApplication
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (TypeApplicationController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el tipo de aplicación.',
                error: error.message,
            });
        }
    }
}

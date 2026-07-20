import { Request, Response } from "express";
import { UserCompanyUseCase } from "../../../application/user-company/user-company-use-case";

export class UserCompanyController {
    constructor(private userCompanyUseCase: UserCompanyUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getByUserCtrl = this.getByUserCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const relations = await this.userCompanyUseCase.getUserCompanies();
            return res.status(200).send({
                success: true,
                message: 'Relaciones usuario-empresa retornadas.',
                data: relations
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (UserCompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las relaciones.',
                error: error.message,
            });
        }
    }

    public async getByUserCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid || (req as any).user?.usr_uuid;
            if (!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudieron recuperar las empresas del usuario.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            const relations = await this.userCompanyUseCase.getUserCompaniesByUserId(usr_uuid);
            return res.status(200).send({
                success: true,
                message: 'Empresas del usuario retornadas.',
                data: relations
            });
        } catch (error: any) {
            console.error('Error en getByUserCtrl (UserCompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las empresas del usuario.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usrcmp_uuid = req.params.usrcmp_uuid;
            if (!usrcmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la relación.',
                    error: 'Debe proporcionar un Id de relación.'
                });
            }
            const relation = await this.userCompanyUseCase.getDetailUserCompany(usrcmp_uuid);
            return res.status(200).send({
                success: true,
                message: 'Relación retornada.',
                data: relation
            });
        } catch (error: any) {
            console.error('Error en getCtrl (UserCompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la relación.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { usr_uuid, cmp_uuid, usrcmp_role } = req.body;
            if (!usr_uuid || !cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar la relación.',
                    error: 'Debe proporcionar el Id de usuario (usr_uuid) y de empresa (cmp_uuid).'
                });
            }
            const relation = await this.userCompanyUseCase.saveUserCompany(req.body);
            return res.status(200).json({
                success: true,
                message: 'Relación registrada.',
                data: relation
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (UserCompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la relación.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usrcmp_uuid = req.params.usrcmp_uuid;
            const update = req.body;
            if (!usrcmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la relación.',
                    error: 'Debe proporcionar un Id de relación.'
                });
            }
            const relation = await this.userCompanyUseCase.updateUserCompany(usrcmp_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Relación actualizada.',
                data: relation
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (UserCompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la relación.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usrcmp_uuid = req.params.usrcmp_uuid;
            if (!usrcmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la relación.',
                    error: 'Debe proporcionar un Id de relación.'
                });
            }
            const relation = await this.userCompanyUseCase.deleteUserCompany(usrcmp_uuid);
            return res.status(200).json({
                success: true,
                message: 'Relación eliminada.',
                data: relation
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (UserCompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la relación.',
                error: error.message,
            });
        }
    }
}

import { Request, Response } from "express";
import { CompanyUseCase } from "../../../application/company/company-use-case";

export class CompanyController {
    constructor(private companyUseCase: CompanyUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const companies = await this.companyUseCase.getCompanies();
            return res.status(200).send({
                success: true,
                message: 'Empresas retornadas.',
                data: companies
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las empresas.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const cmp_uuid = req.params.cmp_uuid;
            if (!cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la empresa.',
                    error: 'Debe proporcionar un Id de empresa.'
                });
            }
            const company = await this.companyUseCase.getDetailCompany(cmp_uuid);
            return res.status(200).send({
                success: true,
                message: 'Empresa retornada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en getCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la empresa.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { cmp_cod, cmp_name } = req.body;
            if (!cmp_cod || !cmp_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar la empresa.',
                    error: 'Debe proporcionar el Código (cmp_cod) y Nombre (cmp_name).'
                });
            }
            const company = await this.companyUseCase.saveCompany(req.body);
            return res.status(200).json({
                success: true,
                message: 'Empresa registrada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la empresa.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const cmp_uuid = req.params.cmp_uuid;
            const update = req.body;
            if (!cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la empresa.',
                    error: 'Debe proporcionar un Id de empresa.'
                });
            }
            const company = await this.companyUseCase.updateCompany(cmp_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Empresa actualizada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la empresa.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const cmp_uuid = req.params.cmp_uuid;
            if (!cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la empresa.',
                    error: 'Debe proporcionar un Id de empresa.'
                });
            }
            const company = await this.companyUseCase.deleteCompany(cmp_uuid);
            return res.status(200).json({
                success: true,
                message: 'Empresa eliminada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la empresa.',
                error: error.message,
            });
        }
    }
}

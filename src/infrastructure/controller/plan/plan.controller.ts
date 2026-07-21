import { Request, Response } from "express";
import { PlanUseCase } from "../../../application/plan/plan-use-case";

export class PlanController {
    constructor(private planUseCase: PlanUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const plans = await this.planUseCase.getPlans();
            return res.status(200).send({
                success: true,
                message: 'Planes retornados.',
                data: plans
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (PlanController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los planes.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const pla_uuid = req.params.pla_uuid;
            if (!pla_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el plan.',
                    error: 'Debe proporcionar un Id de plan.'
                });
            }
            const plan = await this.planUseCase.getDetailPlan(pla_uuid);
            return res.status(200).send({
                success: true,
                message: 'Plan retornado.',
                data: plan
            });
        } catch (error: any) {
            console.error('Error en getCtrl (PlanController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el plan.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { app_uuid, pla_cod, pla_name } = req.body;
            if (!app_uuid || !pla_cod || !pla_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar el plan.',
                    error: 'Debe proporcionar app_uuid, pla_cod y pla_name.'
                });
            }
            const plan = await this.planUseCase.savePlan(req.body);
            return res.status(200).json({
                success: true,
                message: 'Plan registrado.',
                data: plan
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (PlanController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar el plan.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const pla_uuid = req.params.pla_uuid;
            const update = req.body;
            if (!pla_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el plan.',
                    error: 'Debe proporcionar un Id de plan.'
                });
            }
            const plan = await this.planUseCase.updatePlan(pla_uuid, update.app_uuid || '', update);
            return res.status(200).json({
                success: true,
                message: 'Plan actualizado.',
                data: plan
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (PlanController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el plan.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const pla_uuid = req.params.pla_uuid;
            if (!pla_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el plan.',
                    error: 'Debe proporcionar un Id de plan.'
                });
            }
            const plan = await this.planUseCase.deletePlan(pla_uuid, '');
            return res.status(200).json({
                success: true,
                message: 'Plan eliminado.',
                data: plan
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (PlanController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el plan.',
                error: error.message,
            });
        }
    }
}

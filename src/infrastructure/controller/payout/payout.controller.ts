import { Request, Response } from "express";
import { PayoutUseCase } from "../../../application/payout/payout-use-case";

export class PayoutController {
    constructor(private payoutUseCase: PayoutUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getByCompanyCtrl = this.getByCompanyCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const payouts = await this.payoutUseCase.getPayouts();
            return res.status(200).send({
                success: true,
                message: 'Liquidaciones retornadas.',
                data: payouts
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (PayoutController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las liquidaciones.',
                error: error.message,
            });
        }
    }

    public async getByCompanyCtrl(req: Request, res: Response) {
        try {
            const cmp_uuid = req.params.cmp_uuid;
            if (!cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Falta el Id de la empresa.',
                    error: 'Debe especificar cmp_uuid.'
                });
            }
            const payouts = await this.payoutUseCase.getPayouts(cmp_uuid);
            return res.status(200).send({
                success: true,
                message: 'Liquidaciones de la empresa retornadas.',
                data: payouts
            });
        } catch (error: any) {
            console.error('Error en getByCompanyCtrl (PayoutController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las liquidaciones.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const pay_uuid = req.params.pay_uuid;
            if (!pay_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Falta el Id de la liquidación.',
                    error: 'Debe proporcionar pay_uuid.'
                });
            }
            const payout = await this.payoutUseCase.getDetailPayout(pay_uuid);
            return res.status(200).send({
                success: true,
                message: 'Liquidación retornada.',
                data: payout
            });
        } catch (error: any) {
            console.error('Error en getCtrl (PayoutController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la liquidación.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { cmp_uuid, pay_amount, pay_provider } = req.body;
            if (!cmp_uuid || pay_amount === undefined || !pay_provider) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios.',
                    error: 'Debe proporcionar cmp_uuid, pay_amount y pay_provider.'
                });
            }
            const payout = await this.payoutUseCase.savePayout(req.body);
            return res.status(200).json({
                success: true,
                message: 'Liquidación registrada.',
                data: payout
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (PayoutController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la liquidación.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const pay_uuid = req.params.pay_uuid;
            const update = req.body;
            if (!pay_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Falta el Id de la liquidación.',
                    error: 'Debe proporcionar pay_uuid.'
                });
            }
            const payout = await this.payoutUseCase.updatePayout(pay_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Liquidación actualizada.',
                data: payout
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (PayoutController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la liquidación.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const pay_uuid = req.params.pay_uuid;
            if (!pay_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Falta el Id de la liquidación.',
                    error: 'Debe proporcionar pay_uuid.'
                });
            }
            const payout = await this.payoutUseCase.deletePayout(pay_uuid);
            return res.status(200).json({
                success: true,
                message: 'Liquidación eliminada.',
                data: payout
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (PayoutController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la liquidación.',
                error: error.message,
            });
        }
    }
}

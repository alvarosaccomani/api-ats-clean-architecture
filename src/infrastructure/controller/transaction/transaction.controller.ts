import { Request, Response } from "express";
import { TransactionUseCase } from "../../../application/transaction/transaction-use-case";

export class TransactionController {
    constructor(private transactionUseCase: TransactionUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getBySubscriberCtrl = this.getBySubscriberCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const transactions = await this.transactionUseCase.getTransactions();
            return res.status(200).send({
                success: true,
                message: 'Transacciones retornadas.',
                data: transactions
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (TransactionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las transacciones.',
                error: error.message,
            });
        }
    }

    public async getBySubscriberCtrl(req: Request, res: Response) {
        try {
            const { type, id } = req.params; // type = 'USER' | 'COMPANY'
            if (!type || !id) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan parámetros de búsqueda de transacciones.',
                    error: 'Debe especificar el Tipo (USER o COMPANY) y el Id.'
                });
            }
            const usr_uuid = type.toUpperCase() === 'USER' ? id : undefined;
            const cmp_uuid = type.toUpperCase() === 'COMPANY' ? id : undefined;
            const transactions = await this.transactionUseCase.getTransactions(usr_uuid, cmp_uuid);
            return res.status(200).send({
                success: true,
                message: 'Transacciones del suscriptor retornadas.',
                data: transactions
            });
        } catch (error: any) {
            console.error('Error en getBySubscriberCtrl (TransactionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las transacciones.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const trn_uuid = req.params.trn_uuid;
            if (!trn_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Falta el Id de la transacción.',
                    error: 'Debe proporcionar trn_uuid.'
                });
            }
            const transaction = await this.transactionUseCase.getDetailTransaction(trn_uuid);
            return res.status(200).send({
                success: true,
                message: 'Transacción retornada.',
                data: transaction
            });
        } catch (error: any) {
            console.error('Error en getCtrl (TransactionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la transacción.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { app_uuid, trn_provider, trn_amount, trn_netamount } = req.body;
            if (!app_uuid || !trn_provider || trn_amount === undefined || trn_netamount === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios.',
                    error: 'Debe proporcionar app_uuid, trn_provider, trn_amount y trn_netamount.'
                });
            }
            const transaction = await this.transactionUseCase.saveTransaction(req.body);
            return res.status(200).json({
                success: true,
                message: 'Transacción registrada.',
                data: transaction
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (TransactionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la transacción.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const trn_uuid = req.params.trn_uuid;
            const update = req.body;
            if (!trn_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Falta el Id de la transacción.',
                    error: 'Debe proporcionar trn_uuid.'
                });
            }
            const transaction = await this.transactionUseCase.updateTransaction(trn_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Transacción actualizada.',
                data: transaction
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (TransactionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la transacción.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const trn_uuid = req.params.trn_uuid;
            if (!trn_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Falta el Id de la transacción.',
                    error: 'Debe proporcionar trn_uuid.'
                });
            }
            const transaction = await this.transactionUseCase.deleteTransaction(trn_uuid);
            return res.status(200).json({
                success: true,
                message: 'Transacción eliminada.',
                data: transaction
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (TransactionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la transacción.',
                error: error.message,
            });
        }
    }
}

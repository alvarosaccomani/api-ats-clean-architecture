import { TransactionEntity, TransactionUpdateData } from "../../../domain/transaction/transaction.entity";
import { TransactionRepository } from "../../../domain/transaction/transaction.repository";
import { SequelizeTransaction } from "../../model/transaction/transaction.model";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeCompany } from "../../model/company/company.model";
import { SequelizeApplication } from "../../model/application/application.model";

export class SequelizeTransactionRepository implements TransactionRepository {
    async getTransactions(usr_uuid?: string, cmp_uuid?: string): Promise<TransactionEntity[] | null> {
        try {
            const whereClause: any = {};
            if (usr_uuid) whereClause.usr_uuid = usr_uuid;
            if (cmp_uuid) whereClause.cmp_uuid = cmp_uuid;

            const transactions = await SequelizeTransaction.findAll({
                where: whereClause,
                include: [
                    { model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] },
                    { model: SequelizeCompany, as: 'company', attributes: ['cmp_uuid', 'cmp_name'] },
                    { model: SequelizeApplication, as: 'application', attributes: ['app_uuid', 'app_name'] }
                ],
                order: [['trn_createdat', 'DESC']]
            });
            return transactions;
        } catch (error: any) {
            console.error('Error en getTransactions:', error.message);
            throw error;
        }
    }

    async findTransactionById(trn_uuid: string): Promise<TransactionEntity | null> {
        try {
            const transaction = await SequelizeTransaction.findByPk(trn_uuid, {
                include: [
                    { model: SequelizeUser, as: 'user' },
                    { model: SequelizeCompany, as: 'company' },
                    { model: SequelizeApplication, as: 'application' }
                ]
            });
            return transaction ? transaction.dataValues : null;
        } catch (error: any) {
            console.error('Error en findTransactionById:', error.message);
            throw error;
        }
    }

    async createTransaction(transaction: TransactionEntity): Promise<TransactionEntity | null> {
        try {
            const created = await SequelizeTransaction.create(transaction as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createTransaction:', error.message);
            throw error;
        }
    }

    async updateTransaction(trn_uuid: string, transaction: TransactionUpdateData): Promise<TransactionEntity | null> {
        try {
            const [updatedRows] = await SequelizeTransaction.update(transaction, {
                where: { trn_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la transacción con Id: ${trn_uuid}`);
            }
            const updated = await SequelizeTransaction.findByPk(trn_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateTransaction:', error.message);
            throw error;
        }
    }

    async deleteTransaction(trn_uuid: string): Promise<TransactionEntity | null> {
        try {
            const transaction = await SequelizeTransaction.findByPk(trn_uuid);
            if (!transaction) {
                throw new Error(`No se encontró la transacción con Id: ${trn_uuid}`);
            }
            await SequelizeTransaction.destroy({
                where: { trn_uuid }
            });
            return transaction.dataValues;
        } catch (error: any) {
            console.error('Error en deleteTransaction:', error.message);
            throw error;
        }
    }
}

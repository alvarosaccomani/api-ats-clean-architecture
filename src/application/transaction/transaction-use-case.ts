import { TransactionRepository } from "../../domain/transaction/transaction.repository";
import { TransactionEntity, TransactionUpdateData } from "../../domain/transaction/transaction.entity";
import { TransactionValue } from "../../domain/transaction/transaction.value";
import { SequelizeTransactionRepository } from "../../infrastructure/repository/transaction/sequelize-transaction.repository";

export class TransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    public async getTransactions(usr_uuid?: string, cmp_uuid?: string): Promise<TransactionEntity[] | null> {
        if (this.transactionRepository instanceof SequelizeTransactionRepository) {
            return await this.transactionRepository.getTransactions(usr_uuid, cmp_uuid);
        }
        return await this.transactionRepository.getTransactions();
    }

    public async getDetailTransaction(trn_uuid: string): Promise<TransactionEntity | null> {
        const transaction = await this.transactionRepository.findTransactionById(trn_uuid);
        return transaction;
    }

    public async saveTransaction(data: {
        usr_uuid?: string;
        sub_uuid?: string;
        cmp_uuid?: string;
        app_uuid: string;
        trn_provider: string;
        trn_providerid?: string;
        trn_amount: number;
        trn_currency: string;
        trn_platformfee: number;
        trn_netamount: number;
        trn_status: string;
        trn_paymentmethod?: string;
        trn_description?: string;
        trn_metadata?: string;
    }): Promise<TransactionEntity | null> {
        const valueObj = new TransactionValue(data);
        const created = await this.transactionRepository.createTransaction(valueObj);
        return created;
    }

    public async updateTransaction(trn_uuid: string, updateData: TransactionUpdateData): Promise<TransactionEntity | null> {
        const updated = await this.transactionRepository.updateTransaction(trn_uuid, updateData);
        return updated;
    }

    public async deleteTransaction(trn_uuid: string): Promise<TransactionEntity | null> {
        const deleted = await this.transactionRepository.deleteTransaction(trn_uuid);
        return deleted;
    }
}

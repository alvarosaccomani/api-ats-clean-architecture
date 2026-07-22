import { TransactionEntity, TransactionUpdateData } from "./transaction.entity";

export interface TransactionRepository {
    getTransactions(): Promise<TransactionEntity[] | null>;
    findTransactionById(trn_uuid: string): Promise<TransactionEntity | null>;
    createTransaction(transaction: TransactionEntity): Promise<TransactionEntity | null>;
    updateTransaction(trn_uuid: string, transaction: TransactionUpdateData): Promise<TransactionEntity | null>;
    deleteTransaction(trn_uuid: string): Promise<TransactionEntity | null>;
}
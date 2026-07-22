export interface TransactionEntity {
    trn_uuid: string,
    usr_uuid?: string,
    sub_uuid?: string,
    cmp_uuid?: string,
    app_uuid: string,
    trn_provider: string,
    trn_providerid?: string,
    trn_amount: number,
    trn_currency: string,
    trn_platformfee: number,
    trn_netamount: number,
    trn_status: string,
    trn_paymentmethod?: string,
    trn_description?: string,
    trn_metadata?: string,
    trn_createdat: Date,
    trn_updatedat: Date        
}

//Update
export type TransactionUpdateData = Pick<TransactionEntity, 'trn_provider' | 'trn_providerid' | 'trn_amount' | 'trn_currency' | 'trn_platformfee' | 'trn_netamount' | 'trn_status' | 'trn_paymentmethod' | 'trn_description' | 'trn_metadata'>
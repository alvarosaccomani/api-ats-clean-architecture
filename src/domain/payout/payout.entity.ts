export interface PayoutEntity {
    pay_uuid: string,
    cmp_uuid: string,
    pay_amount: number,
    pay_currency: string,
    pay_status: string,
    pay_provider: string,
    pay_providerid?: string,
    pay_reference?: string,
    pay_createdat: Date,
    pay_updatedat: Date
}

//Update
export type PayoutUpdateData = Pick<PayoutEntity, 'pay_amount' | 'pay_currency' | 'pay_status' | 'pay_provider' | 'pay_providerid' | 'pay_reference'>
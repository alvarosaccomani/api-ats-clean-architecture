import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PayoutEntity } from "./payout.entity";

export class PayoutValue implements PayoutEntity {
    pay_uuid: string;
    cmp_uuid: string;
    pay_amount: number;
    pay_currency: string;
    pay_status: string;
    pay_provider: string;
    pay_providerid?: string;
    pay_reference?: string;
    pay_createdat: Date;
    pay_updatedat: Date;
    
    
    constructor({
            pay_uuid,
            cmp_uuid,
            pay_amount,
            pay_currency,
            pay_status,
            pay_provider,
            pay_providerid,
            pay_reference,
            pay_createdat,
            pay_updatedat
        }:{ 
            pay_uuid?: string,
            cmp_uuid: string,
            pay_amount: number,
            pay_currency: string,
            pay_status: string,
            pay_provider: string,
            pay_providerid?: string,
            pay_reference?: string,
            pay_createdat?: Date,
            pay_updatedat?: Date,
        }) {
        this.pay_uuid = pay_uuid || uuid();
        this.cmp_uuid = cmp_uuid;
        this.pay_amount = pay_amount;
        this.pay_currency = pay_currency;
        this.pay_status = pay_status;
        this.pay_provider = pay_provider;
        this.pay_providerid = pay_providerid;
        this.pay_reference = pay_reference;
        this.pay_createdat = pay_createdat ?? moment().toDate();
        this.pay_updatedat = pay_updatedat ?? moment().toDate();
    }
}
import { v4 as uuid } from "uuid";
import moment from 'moment';
import { TransactionEntity } from "./transaction.entity";

export class TransactionValue implements TransactionEntity {
    trn_uuid: string;
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
    trn_createdat: Date;
    trn_updatedat: Date;

    
    
    
    constructor({
            trn_uuid, 
            usr_uuid, 
            sub_uuid,
            cmp_uuid,
            app_uuid,
            trn_provider,
            trn_providerid,
            trn_amount,
            trn_currency,
            trn_platformfee,
            trn_netamount,
            trn_status,
            trn_paymentmethod,
            trn_description,
            trn_metadata,
            trn_createdat,
            trn_updatedat
        }:{ 
            trn_uuid?: string,
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
            trn_createdat?: Date,
            trn_updatedat?: Date,
        }) {
        this.trn_uuid = trn_uuid || uuid();
        this.usr_uuid = usr_uuid;
        this.sub_uuid = sub_uuid;
        this.cmp_uuid = cmp_uuid;
        this.app_uuid = app_uuid;
        this.trn_provider = trn_provider;
        this.trn_providerid = trn_providerid;
        this.trn_amount = trn_amount;
        this.trn_currency = trn_currency;
        this.trn_platformfee = trn_platformfee;
        this.trn_netamount = trn_netamount;
        this.trn_status = trn_status;
        this.trn_paymentmethod = trn_paymentmethod;
        this.trn_description = trn_description;
        this.trn_metadata = trn_metadata;
        this.trn_createdat = trn_createdat ?? moment().toDate();
        this.trn_updatedat = trn_updatedat ?? moment().toDate();
    }
}
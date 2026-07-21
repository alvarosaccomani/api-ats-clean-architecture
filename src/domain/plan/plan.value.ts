import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PlanEntity } from "./plan.entity";

export class PlanValue implements PlanEntity {
    pla_uuid: string;
    app_uuid: string;
    pla_cod: string;
    pla_name: string;
    pla_description: string;
    pla_price: number;
    pla_currency: string;
    pla_billingcycle: string;
    pla_pricingtype: string;
    pla_platformfeepercent: number;
    pla_active: boolean;
    pla_createdat: Date;
    pla_updatedat: Date;
    
    constructor({
            pla_uuid, 
            app_uuid, 
            pla_cod,
            pla_name,
            pla_description,
            pla_price,
            pla_currency,
            pla_billingcycle,
            pla_pricingtype,
            pla_platformfeepercent,
            pla_active,
            pla_createdat,
            pla_updatedat
        }:{ 
            pla_uuid?: string,
            app_uuid: string,
            pla_cod: string,
            pla_name: string,
            pla_description: string,
            pla_price: number,
            pla_currency: string,
            pla_billingcycle: string,
            pla_pricingtype: string,
            pla_platformfeepercent: number,
            pla_active: boolean,
            pla_createdat?: Date,
            pla_updatedat?: Date,
        }) {
        this.pla_uuid = pla_uuid || uuid();
        this.app_uuid = app_uuid;
        this.pla_cod = pla_cod;
        this.pla_name = pla_name;
        this.pla_description = pla_description;
        this.pla_price = pla_price;
        this.pla_currency = pla_currency;        
        this.pla_billingcycle = pla_billingcycle;
        this.pla_pricingtype = pla_pricingtype;
        this.pla_platformfeepercent = pla_platformfeepercent;
        this.pla_active= pla_active ?? false;
        this.pla_createdat = pla_createdat ?? moment().toDate();
        this.pla_updatedat = pla_updatedat ?? moment().toDate();
    }
}
export interface PlanEntity {
    pla_uuid: string,
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
    pla_createdat: Date,
    pla_updatedat: Date
}

//Update
export type PlanUpdateData = Pick<PlanEntity, 'pla_cod' | 'pla_name' | 'pla_description' | 'pla_price' | 'pla_currency' | 'pla_billingcycle' | 'pla_pricingtype' | 'pla_platformfeepercent' | 'pla_active'>
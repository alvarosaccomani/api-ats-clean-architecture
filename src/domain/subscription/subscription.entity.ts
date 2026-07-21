export interface SubscriptionEntity {
    pla_uuid: string,
    app_uuid: string,
    sub_uuid: string,
    sub_subscribertype: string,
    usr_uuid?: string,
    cmp_uuid?: string,
    sub_status: string,
    sub_startsat: Date,
    sub_renewsat: Date,
    sub_endsat: Date,
    sub_active: boolean,
    sub_createdat: Date,
    sub_updatedat: Date
}

//Update
export type SubscriptionUpdateData = Pick<SubscriptionEntity, 'sub_subscribertype' | 'usr_uuid' | 'cmp_uuid' | 'sub_status' | 'sub_startsat' | 'sub_renewsat' | 'sub_endsat' | 'sub_active'>
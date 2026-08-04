export interface SystemEventEntity {
    sysev_uuid: string,
    usr_uuid: string | null,
    sysev_action: string,
    sysev_entitytype: string,
    sysev_entityuuid: string,
    sysev_details: string | null,
    sysev_ipaddress: string | null,
    sysev_useragent: string | null,
    sysev_createdat: Date
}

//Update
export type SystemEventUpdateData = Pick<SystemEventEntity, 'sysev_action' | 'sysev_entitytype' | 'sysev_entityuuid' | 'sysev_details' | 'sysev_ipaddress' | 'sysev_useragent'>

export interface UserAuthLogEntity {
    usr_uuid: string,
    usraulo_uuid: string,
    app_uuid: string,
    usraulo_action: string,
    usraulo_ipaddress: string,
    usraulo_useragent: string,
    usraulo_failurereason: string,
    usraulo_createdat: Date
}

//Update
export type UserAuthLogUpdateData = Pick<UserAuthLogEntity, 'app_uuid' | 'usraulo_action' | 'usraulo_ipaddress' | 'usraulo_useragent' | 'usraulo_failurereason'>
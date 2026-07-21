export interface UserSessionEntity {
    usr_uuid: string,
    usrs_uuid: string,
    usrs_device: string,
    usrs_ipaddress: string,
    usrs_refreshtoken: string,
    usrs_createdat: Date,
    usrs_updatedat: Date
}

//Update
export type UserSessionUpdateData = Pick<UserSessionEntity, 'usrs_device' | 'usrs_ipaddress' | 'usrs_refreshtoken'>
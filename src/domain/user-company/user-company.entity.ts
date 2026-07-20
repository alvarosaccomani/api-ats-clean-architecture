export interface UserCompanyEntity {
    usr_uuid: string,
    cmp_uuid: string,
    usrcmp_uuid: string,
    usrcmp_role: string,
    usrcmp_active: boolean,
    usrcmp_createdat: Date,
    usrcmp_updatedat: Date
}

//Update
export type UserCompanyUpdateData = Pick<UserCompanyEntity, 'usrcmp_role' | 'usrcmp_active'>
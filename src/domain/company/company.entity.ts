export interface CompanyEntity {
    cmp_uuid: string,
    cmp_cod: string,
    cmp_name: string,
    cmp_cuit: string,
    cmp_address: string,
    cmp_phone: string,
    cmp_email: string,
    cmp_description: string,
    cmp_image: string,
    cmp_active: boolean,
    cmp_createdat: Date,
    cmp_updatedat: Date
}

//Update
export type CompanyUpdateData = Pick<CompanyEntity, 'cmp_cod' | 'cmp_name' | 'cmp_cuit' | 'cmp_address' | 'cmp_phone' | 'cmp_email' | 'cmp_description' | 'cmp_image' | 'cmp_active'>
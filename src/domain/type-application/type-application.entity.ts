export interface TypeApplicationEntity {
    tapp_uuid: string,
    tapp_cod: string,
    tapp_name: string,
    tapp_description: string,
    tapp_bkcolor: string,
    tapp_frcolor: string,
    tapp_active: boolean,
    tapp_createdat: Date,
    tapp_updatedat: Date
}

//Update
export type TypeApplicationUpdateData = Pick<TypeApplicationEntity, 'tapp_cod' | 'tapp_name' | 'tapp_description' | 'tapp_bkcolor' | 'tapp_frcolor' | 'tapp_active'>
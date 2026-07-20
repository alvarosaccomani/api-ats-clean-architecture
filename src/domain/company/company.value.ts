import { v4 as uuid } from "uuid";
import moment from 'moment';
import { CompanyEntity } from "./company.entity";

export class CompanyValue implements CompanyEntity {
    cmp_uuid: string;
    cmp_cod: string;
    cmp_name: string;
    cmp_cuit: string;
    cmp_address: string;
    cmp_phone: string;
    cmp_email: string;
    cmp_description: string;
    cmp_image: string;
    cmp_active: boolean;
    cmp_createdat: Date;
    cmp_updatedat: Date;
    
    constructor({
            cmp_uuid, 
            cmp_cod, 
            cmp_name,
            cmp_cuit,
            cmp_address,
            cmp_phone,
            cmp_email,
            cmp_description,
            cmp_image,
            cmp_active,
            cmp_createdat,
            cmp_updatedat
        }:{ 
            cmp_uuid?: string,
            cmp_cod: string,
            cmp_name: string,
            cmp_cuit: string,
            cmp_address: string,
            cmp_phone: string,
            cmp_email: string,
            cmp_description: string,
            cmp_image: string,
            cmp_active: boolean,
            cmp_createdat?: Date,
            cmp_updatedat?: Date,
        }) {
        this.cmp_uuid = cmp_uuid || uuid();
        this.cmp_cod = cmp_cod;
        this.cmp_name = cmp_name;
        this.cmp_cuit = cmp_cuit;
        this.cmp_address = cmp_address;
        this.cmp_phone = cmp_address;
        this.cmp_phone = cmp_phone;
        this.cmp_email = cmp_email;        
        this.cmp_description = cmp_description;
        this.cmp_image = cmp_image;
        this.cmp_active= cmp_active ?? false;
        this.cmp_createdat = cmp_createdat ?? moment().toDate();
        this.cmp_updatedat = cmp_updatedat ?? moment().toDate();
    }
}
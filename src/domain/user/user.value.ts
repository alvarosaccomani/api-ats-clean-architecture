import { v4 as uuid } from "uuid";
import moment from 'moment';
import { UserEntity } from "./user.entity";

export class UserValue implements UserEntity {
    usr_uuid: string;
    usr_name: string;
    usr_surname: string;
    usr_password: string;
    usr_image: string;
    usr_email: string;
    usr_nick: string;
    usr_bio: string;
    usr_registered: Date;
    usr_socket: string;
    usr_online: boolean;
    usr_confirmed: boolean;
    usr_confirmationtoken: string;
    usr_resetpasswordtoken: string;
    usr_resetpasswordexpires: Date;
    usr_sysadmin: boolean;
    usr_createdat: Date;
    usr_updatedat: Date;
    
    constructor({
            usr_uuid, 
            usr_name, 
            usr_surname,
            usr_password,
            usr_image,
            usr_email,
            usr_nick,
            usr_bio,
            usr_registered,
            usr_socket,
            usr_online,
            usr_confirmed,
            usr_confirmationtoken,
            usr_resetpasswordtoken,
            usr_resetpasswordexpires,
            usr_sysadmin,
            usr_createdat,
            usr_updatedat
        }:{ 
            usr_uuid: string,
            usr_name: string,
            usr_surname: string,
            usr_password: string,
            usr_image: string,
            usr_email: string,
            usr_nick: string,
            usr_bio: string,
            usr_registered: Date,
            usr_socket: string,
            usr_online: boolean,
            usr_confirmed: boolean,
            usr_confirmationtoken: string
            usr_resetpasswordtoken: string,
            usr_resetpasswordexpires: Date,
            usr_sysadmin: boolean,
            usr_createdat?: Date,
            usr_updatedat?: Date,
        }) {
        this.usr_uuid = uuid();
        this.usr_name = usr_name;
        this.usr_surname = usr_surname;
        this.usr_password = usr_password;
        this.usr_image = usr_image;
        this.usr_email = usr_email;
        this.usr_nick = usr_nick;
        this.usr_bio = usr_bio ?? null;
        this.usr_registered = usr_registered ?? moment().toDate();
        this.usr_socket = usr_socket;
        this.usr_online = usr_online ?? false;
        this.usr_confirmed = usr_confirmed ?? false;
        this.usr_confirmationtoken = usr_confirmationtoken ?? '';
        this.usr_resetpasswordtoken = usr_resetpasswordtoken;
        this.usr_resetpasswordexpires = usr_resetpasswordexpires;
        this.usr_sysadmin = usr_sysadmin ?? false;
        this.usr_createdat = usr_createdat ?? moment().toDate();
        this.usr_updatedat = usr_updatedat ?? moment().toDate();
    }
}
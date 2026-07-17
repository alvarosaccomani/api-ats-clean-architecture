import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import { UserEntity } from "../../domain/user/user.entity";

export function createToken(user: UserEntity) {
    const secret = process.env.JWT_SECRET || 'web_app_ats_works_api';
    const payload =  {
        sub: user.usr_uuid,
        usr_nick: user.usr_nick,
        usr_name: user.usr_name,
        usr_surname: user.usr_surname,
        usr_email: user.usr_email,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.sign(payload, secret)
}
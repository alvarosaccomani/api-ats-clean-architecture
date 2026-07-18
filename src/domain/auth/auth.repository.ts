import { UserEntity } from "../user/user.entity";

export interface AuthRepository {
    loginUser(usr_nick: string, usr_password: string, gettoken: boolean): Promise<UserEntity | String | null>;
    registerUser(user: UserEntity): Promise<UserEntity | null>;
    confirmAccount(usr_confirmationtoken: string): Promise<UserEntity | null>;
    forgotPassword(user: UserEntity): Promise<UserEntity | null>;
    findUserByResetToken(token: string, expirationDate: Date): Promise<UserEntity | null>;
    findUserByNick(usr_nick: string): Promise<UserEntity | null>;
    findUserByEmail(usr_email: string): Promise<UserEntity | null>;
    updatePassword(usr_uuid: string, newPassword: string): Promise<void>;
}

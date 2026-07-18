import { UserEntity, UserUpdateData } from "./user.entity";

export interface UserRepository {
    getUsers(): Promise<UserEntity[] | null>;
    findUserById(usr_uuid: string): Promise<UserEntity | null>;
    findUserByEmail(usr_email: string): Promise<UserEntity | null>;
    saveUser(user: UserEntity): Promise<UserEntity | null>;
    updateUser(usr_uuid: string, user: UserUpdateData): Promise<UserEntity | null>;
    deleteUser(usr_uuid: string): Promise<UserEntity | null>;
    userExist(usr_nick: string, usr_email: string): Promise<UserEntity | null>;
    setSocketUser(usr_uuid: string, usr_socket: string, usr_online: boolean): Promise<UserEntity | null>;
    findUserByNick(usr_nick: string): Promise<UserEntity | null>;
    findSocketUser(usr_uuid: string): Promise<string | null>;
}
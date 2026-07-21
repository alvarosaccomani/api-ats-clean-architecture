import { UserAuthLogEntity, UserAuthLogUpdateData } from "./user-auth-log.entity";

export interface UserAuthLogRepository {
    getUserAuthLogs(usr_uuid: string): Promise<UserAuthLogEntity[] | null>;
    findUserAuthLogById(usr_uuid: string, usraulo_uuid: string): Promise<UserAuthLogEntity | null>;
    createUserAuthLog(userauthlog: UserAuthLogEntity): Promise<UserAuthLogEntity | null>;
    updateUserAuthLog(usr_uuid: string, usraulo_uuid: string, userauthlog: UserAuthLogUpdateData): Promise<UserAuthLogEntity | null>;
    deleteUserAuthLog(usr_uuid: string, usraulo_uuid: string): Promise<UserAuthLogEntity | null>;
}
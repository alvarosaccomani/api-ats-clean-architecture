import { UserSessionEntity, UserSessionUpdateData } from "./user-session.entity";

export interface UserSessionRepository {
    getUserSessions(usr_uuid: string): Promise<UserSessionEntity[] | null>;
    findUserSessionById(usr_uuid: string, usrs_uuid: string): Promise<UserSessionEntity | null>;
    createUserSession(usersession: UserSessionEntity): Promise<UserSessionEntity | null>;
    updateUserSession(usr_uuid: string, usrs_uuid: string, usersession: UserSessionUpdateData): Promise<UserSessionEntity | null>;
    deleteUserSession(usr_uuid: string, usrs_uuid: string): Promise<UserSessionEntity | null>;
}
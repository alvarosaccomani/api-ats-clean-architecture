import { UserSessionRepository } from "../../domain/user-session/user-session.repository";
import { UserSessionEntity, UserSessionUpdateData } from "../../domain/user-session/user-session.entity";
import { UserSessionValue } from "../../domain/user-session/user-session.value";

export class UserSessionUseCase {
    constructor(private readonly userSessionRepository: UserSessionRepository) {}

    public async getUserSessions(usr_uuid: string): Promise<UserSessionEntity[] | null> {
        const sessions = await this.userSessionRepository.getUserSessions(usr_uuid);
        return sessions;
    }

    public async getDetailUserSession(usr_uuid: string, usrs_uuid: string): Promise<UserSessionEntity | null> {
        const session = await this.userSessionRepository.findUserSessionById(usr_uuid, usrs_uuid);
        return session;
    }

    public async saveUserSession(data: {
        usr_uuid: string;
        usrs_device: string;
        usrs_ipaddress: string;
        usrs_refreshtoken: string;
    }): Promise<UserSessionEntity | null> {
        const valueObj = new UserSessionValue(data);
        const created = await this.userSessionRepository.createUserSession(valueObj);
        return created;
    }

    public async updateUserSession(usr_uuid: string, usrs_uuid: string, updateData: UserSessionUpdateData): Promise<UserSessionEntity | null> {
        const updated = await this.userSessionRepository.updateUserSession(usr_uuid, usrs_uuid, updateData);
        return updated;
    }

    public async deleteUserSession(usr_uuid: string, usrs_uuid: string): Promise<UserSessionEntity | null> {
        const deleted = await this.userSessionRepository.deleteUserSession(usr_uuid, usrs_uuid);
        return deleted;
    }
}

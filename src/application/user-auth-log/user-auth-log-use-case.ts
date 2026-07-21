import { UserAuthLogRepository } from "../../domain/user-auth-log/user-auth-log.repository";
import { UserAuthLogEntity, UserAuthLogUpdateData } from "../../domain/user-auth-log/user-auth-log.entity";
import { UserAuthLogValue } from "../../domain/user-auth-log/user-auth-log.value";

export class UserAuthLogUseCase {
    constructor(private readonly userAuthLogRepository: UserAuthLogRepository) {}

    public async getUserAuthLogs(usr_uuid?: string): Promise<UserAuthLogEntity[] | null> {
        const logs = await this.userAuthLogRepository.getUserAuthLogs(usr_uuid || '');
        return logs;
    }

    public async getDetailUserAuthLog(usr_uuid: string, usraulo_uuid: string): Promise<UserAuthLogEntity | null> {
        const log = await this.userAuthLogRepository.findUserAuthLogById(usr_uuid, usraulo_uuid);
        return log;
    }

    public async saveUserAuthLog(data: {
        usr_uuid: string;
        app_uuid: string;
        usraulo_action: string;
        usraulo_ipaddress: string;
        usraulo_useragent: string;
        usraulo_failurereason: string;
    }): Promise<UserAuthLogEntity | null> {
        const valueObj = new UserAuthLogValue(data);
        const created = await this.userAuthLogRepository.createUserAuthLog(valueObj);
        return created;
    }

    public async updateUserAuthLog(usr_uuid: string, usraulo_uuid: string, updateData: UserAuthLogUpdateData): Promise<UserAuthLogEntity | null> {
        const updated = await this.userAuthLogRepository.updateUserAuthLog(usr_uuid, usraulo_uuid, updateData);
        return updated;
    }

    public async deleteUserAuthLog(usr_uuid: string, usraulo_uuid: string): Promise<UserAuthLogEntity | null> {
        const deleted = await this.userAuthLogRepository.deleteUserAuthLog(usr_uuid, usraulo_uuid);
        return deleted;
    }
}

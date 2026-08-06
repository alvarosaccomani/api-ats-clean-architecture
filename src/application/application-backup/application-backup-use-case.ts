import { ApplicationBackupRepository } from "../../domain/application-backup/application-backup.repository";
import { ApplicationBackupEntity } from "../../domain/application-backup/application-backup.entity";

export class ApplicationBackupUseCase {
    constructor(private readonly backupRepository: ApplicationBackupRepository) {}

    public async getBackups(app_uuid: string): Promise<ApplicationBackupEntity[]> {
        return this.backupRepository.listBackups(app_uuid);
    }

    public async registerBackup(backup: ApplicationBackupEntity): Promise<ApplicationBackupEntity> {
        return this.backupRepository.createBackup(backup);
    }
}

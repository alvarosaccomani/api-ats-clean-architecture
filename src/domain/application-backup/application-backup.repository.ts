import { ApplicationBackupEntity } from "./application-backup.entity";

export interface ApplicationBackupRepository {
    listBackups(app_uuid: string): Promise<ApplicationBackupEntity[]>;
    createBackup(backup: ApplicationBackupEntity): Promise<ApplicationBackupEntity>;
}

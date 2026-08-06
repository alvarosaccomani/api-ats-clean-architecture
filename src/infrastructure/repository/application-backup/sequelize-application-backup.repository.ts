import { ApplicationBackupRepository } from "../../../domain/application-backup/application-backup.repository";
import { ApplicationBackupEntity } from "../../../domain/application-backup/application-backup.entity";
import { SequelizeAppBackup } from "../../model/application-backup/application-backup.model";
import { SequelizeUser } from "../../model/user/user.model";

export class SequelizeApplicationBackupRepository implements ApplicationBackupRepository {
    public async listBackups(app_uuid: string): Promise<ApplicationBackupEntity[]> {
        return SequelizeAppBackup.findAll({
            where: { app_uuid },
            include: [
                { 
                    model: SequelizeUser, 
                    as: 'user', 
                    attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] 
                }
            ],
            order: [['appbak_createdat', 'DESC']]
        }) as any;
    }

    public async createBackup(backup: ApplicationBackupEntity): Promise<ApplicationBackupEntity> {
        const created = await SequelizeAppBackup.create(backup as any);
        const fullRecord = await SequelizeAppBackup.findByPk(created.appbak_uuid, {
            include: [{ model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] }]
        });
        return fullRecord as any;
    }
}

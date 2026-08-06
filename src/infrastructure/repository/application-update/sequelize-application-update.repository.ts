import { ApplicationUpdateRepository } from "../../../domain/application-update/application-update.repository";
import { ApplicationUpdateEntity } from "../../../domain/application-update/application-update.entity";
import { SequelizeAppUpdate } from "../../model/application-update/application-update.model";
import { SequelizeUser } from "../../model/user/user.model";

export class SequelizeApplicationUpdateRepository implements ApplicationUpdateRepository {
    public async listUpdates(app_uuid: string): Promise<ApplicationUpdateEntity[]> {
        return SequelizeAppUpdate.findAll({
            where: { app_uuid },
            include: [
                { 
                    model: SequelizeUser, 
                    as: 'user', 
                    attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] 
                }
            ],
            order: [['appup_createdat', 'DESC']]
        }) as any;
    }

    public async createUpdate(update: ApplicationUpdateEntity): Promise<ApplicationUpdateEntity> {
        const created = await SequelizeAppUpdate.create(update as any);
        const fullRecord = await SequelizeAppUpdate.findByPk(created.appup_uuid, {
            include: [{ model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] }]
        });
        return fullRecord as any;
    }
}

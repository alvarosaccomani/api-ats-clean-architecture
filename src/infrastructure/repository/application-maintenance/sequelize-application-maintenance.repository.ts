import { ApplicationMaintenanceRepository } from "../../../domain/application-maintenance/application-maintenance.repository";
import { ApplicationMaintenanceEntity } from "../../../domain/application-maintenance/application-maintenance.entity";
import { SequelizeAppMaintenance } from "../../model/application-maintenance/application-maintenance.model";
import { SequelizeUser } from "../../model/user/user.model";

export class SequelizeApplicationMaintenanceRepository implements ApplicationMaintenanceRepository {
    public async listMaintenances(app_uuid: string): Promise<ApplicationMaintenanceEntity[]> {
        return SequelizeAppMaintenance.findAll({
            where: { app_uuid },
            include: [
                { 
                    model: SequelizeUser, 
                    as: 'user', 
                    attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] 
                }
            ],
            order: [['appmaint_createdat', 'DESC']]
        }) as any;
    }

    public async createMaintenance(maint: ApplicationMaintenanceEntity): Promise<ApplicationMaintenanceEntity> {
        const created = await SequelizeAppMaintenance.create(maint as any);
        const fullRecord = await SequelizeAppMaintenance.findByPk(created.appmaint_uuid, {
            include: [{ model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] }]
        });
        return fullRecord as any;
    }
}

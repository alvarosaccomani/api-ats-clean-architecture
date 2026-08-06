import { ApplicationMaintenanceEntity } from "./application-maintenance.entity";

export interface ApplicationMaintenanceRepository {
    listMaintenances(app_uuid: string): Promise<ApplicationMaintenanceEntity[]>;
    createMaintenance(maint: ApplicationMaintenanceEntity): Promise<ApplicationMaintenanceEntity>;
}

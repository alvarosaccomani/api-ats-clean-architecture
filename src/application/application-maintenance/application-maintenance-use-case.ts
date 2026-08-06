import { ApplicationMaintenanceRepository } from "../../domain/application-maintenance/application-maintenance.repository";
import { ApplicationMaintenanceEntity } from "../../domain/application-maintenance/application-maintenance.entity";

export class ApplicationMaintenanceUseCase {
    constructor(private readonly maintenanceRepository: ApplicationMaintenanceRepository) {}

    public async getMaintenances(app_uuid: string): Promise<ApplicationMaintenanceEntity[]> {
        return this.maintenanceRepository.listMaintenances(app_uuid);
    }

    public async registerMaintenance(maint: ApplicationMaintenanceEntity): Promise<ApplicationMaintenanceEntity> {
        return this.maintenanceRepository.createMaintenance(maint);
    }
}

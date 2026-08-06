import { Express } from "express";
import { AppMaintenanceController } from "../../controller/application-maintenance/application-maintenance.controller";
import { SequelizeApplicationMaintenanceRepository } from "../../repository/application-maintenance/sequelize-application-maintenance.repository";
import { ApplicationMaintenanceUseCase } from "../../../application/application-maintenance/application-maintenance-use-case";
import { ensureSysAdmin } from "../../middleware/auth.middleware";

function configureAppMaintenanceRoutes(app: Express, socketAdapter?: any) {
    const repository = new SequelizeApplicationMaintenanceRepository();
    const useCase = new ApplicationMaintenanceUseCase(repository);
    const controller = new AppMaintenanceController(useCase);

    app.get(`/${process.env.BASE_URL_API}/application/:app_uuid/maintenances`, ensureSysAdmin, controller.getMaintenancesCtrl);
    app.post(`/${process.env.BASE_URL_API}/application/:app_uuid/maintenances`, ensureSysAdmin, controller.createMaintenanceCtrl);
}

export default configureAppMaintenanceRoutes;

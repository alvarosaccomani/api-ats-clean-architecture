import { Express } from "express";
import { AppUpdateController } from "../../controller/application-update/application-update.controller";
import { SequelizeApplicationUpdateRepository } from "../../repository/application-update/sequelize-application-update.repository";
import { ApplicationUpdateUseCase } from "../../../application/application-update/application-update-use-case";
import { ensureSysAdmin } from "../../middleware/auth.middleware";

function configureAppUpdateRoutes(app: Express, socketAdapter?: any) {
    const repository = new SequelizeApplicationUpdateRepository();
    const useCase = new ApplicationUpdateUseCase(repository);
    const controller = new AppUpdateController(useCase);

    app.get(`/${process.env.BASE_URL_API}/application/:app_uuid/updates`, ensureSysAdmin, controller.getUpdatesCtrl);
    app.post(`/${process.env.BASE_URL_API}/application/:app_uuid/updates`, ensureSysAdmin, controller.createUpdateCtrl);
}

export default configureAppUpdateRoutes;

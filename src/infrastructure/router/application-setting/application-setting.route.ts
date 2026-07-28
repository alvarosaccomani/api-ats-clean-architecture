import { Express } from "express";
import { SequelizeApplicationSettingRepository } from "../../repository/application-setting/sequelize-application-setting.repository";
import { ApplicationSettingUseCase } from "../../../application/application-setting/application-setting-use-case";
import { ApplicationSettingController } from "../../../infrastructure/controller/application-setting/application-setting.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureApplicationSettingRoutes(app: Express) {
    const repository = new SequelizeApplicationSettingRepository();
    const useCase = new ApplicationSettingUseCase(repository);
    const controller = new ApplicationSettingController(useCase);
    
    app.get(`/${process.env.BASE_URL_API}/application/:app_uuid/settings`, ensureAuth, controller.getSettingsByAppCtrl);
    app.post(`/${process.env.BASE_URL_API}/application/:app_uuid/settings`, ensureAuth, controller.saveSettingCtrl);
    app.put(`/${process.env.BASE_URL_API}/application/:app_uuid/settings/:apps_uuid`, ensureAuth, controller.updateSettingCtrl);
    app.delete(`/${process.env.BASE_URL_API}/application/:app_uuid/settings/:apps_uuid`, ensureAuth, controller.deleteSettingCtrl);
}

export default configureApplicationSettingRoutes;

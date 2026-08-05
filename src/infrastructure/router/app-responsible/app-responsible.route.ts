import { Express } from "express";
import { AppResponsibleController } from "../../controller/app-responsible/app-responsible.controller";
import { ensureSysAdmin } from "../../middleware/auth.middleware";

function configureAppResponsibleRoutes(app: Express, socketAdapter?: any) {
    const controller = new AppResponsibleController();

    app.get(`/${process.env.BASE_URL_API}/app-responsibles/:app_uuid`, ensureSysAdmin, controller.getResponsiblesCtrl);
    app.post(`/${process.env.BASE_URL_API}/app-responsible/:app_uuid`, ensureSysAdmin, controller.assignResponsibleCtrl);
    app.delete(`/${process.env.BASE_URL_API}/app-responsible/:appres_uuid`, ensureSysAdmin, controller.removeResponsibleCtrl);
}

export default configureAppResponsibleRoutes;

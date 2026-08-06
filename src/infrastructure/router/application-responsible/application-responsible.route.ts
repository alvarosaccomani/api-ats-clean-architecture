import { Express } from "express";
import { AppResponsibleController } from "../../controller/application-responsible/application-responsible.controller";
import { ensureSysAdmin } from "../../middleware/auth.middleware";

function configureAppResponsibleRoutes(app: Express, socketAdapter?: any) {
    const controller = new AppResponsibleController();

    app.get(`/${process.env.BASE_URL_API}/application/:app_uuid/responsibles`, ensureSysAdmin, controller.getResponsiblesCtrl);
    app.post(`/${process.env.BASE_URL_API}/application/:app_uuid/responsibles`, ensureSysAdmin, controller.assignResponsibleCtrl);
    app.delete(`/${process.env.BASE_URL_API}/application/responsibles/:appres_uuid`, ensureSysAdmin, controller.removeResponsibleCtrl);
}

export default configureAppResponsibleRoutes;

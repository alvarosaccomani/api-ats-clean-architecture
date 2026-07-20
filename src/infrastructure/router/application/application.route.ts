import { Express } from "express";
import { SequelizeApplicationRepository } from "../../repository/application/sequelize-application.repository";
import { ApplicationUseCase } from "../../../application/application/application-use-case";
import { ApplicationController } from "../../../infrastructure/controller/application/application.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureApplicationRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeAppRepository = new SequelizeApplicationRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const applicationUseCase = new ApplicationUseCase(sequelizeAppRepository);
    
    /*
    *   Iniciar controller
    */
    const applicationCtrl = new ApplicationController(applicationUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/applications`, ensureAuth, applicationCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/application/:app_uuid`, ensureAuth, applicationCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/application`, ensureAuth, applicationCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/application/:app_uuid`, ensureAuth, applicationCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/application/:app_uuid`, ensureAuth, applicationCtrl.deleteCtrl);
}

export default configureApplicationRoutes;

import { Express } from "express";
import { SequelizeTypeApplicationRepository } from "../../repository/type-application/sequelize-type-application.repository";
import { TypeApplicationUseCase } from "../../../application/type-application/type-application-use-case";
import { TypeApplicationController } from "../../controller/type-application/type-application.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureTypeApplicationRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeTypeAppRepository = new SequelizeTypeApplicationRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const typeAppUseCase = new TypeApplicationUseCase(sequelizeTypeAppRepository);
    
    /*
    *   Iniciar controller
    */
    const typeAppCtrl = new TypeApplicationController(typeAppUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/type-applications`, ensureAuth, typeAppCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/type-application/:tapp_uuid`, ensureAuth, typeAppCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/type-application`, ensureAuth, typeAppCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/type-application/:tapp_uuid`, ensureAuth, typeAppCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/type-application/:tapp_uuid`, ensureAuth, typeAppCtrl.deleteCtrl);
}

export default configureTypeApplicationRoutes;

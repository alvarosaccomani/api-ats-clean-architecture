import { Express } from "express";
import { SequelizeUserAuthLogRepository } from "../../repository/user-auth-log/sequelize-user-auth-log.repository";
import { UserAuthLogUseCase } from "../../../application/user-auth-log/user-auth-log-use-case";
import { UserAuthLogController } from "../../controller/user-auth-log/user-auth-log.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureUserAuthLogRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeUserAuthLogRepo = new SequelizeUserAuthLogRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const userAuthLogUseCase = new UserAuthLogUseCase(sequelizeUserAuthLogRepo);
    
    /*
    *   Iniciar controller
    */
    const userAuthLogCtrl = new UserAuthLogController(userAuthLogUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/user-auth-logs`, ensureAuth, userAuthLogCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/user-auth-logs/user/:usr_uuid`, ensureAuth, userAuthLogCtrl.getByUserCtrl);
    app.get(`/${process.env.BASE_URL_API}/user-auth-log/:usraulo_uuid`, ensureAuth, userAuthLogCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/user-auth-log`, ensureAuth, userAuthLogCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/user-auth-log/:usraulo_uuid`, ensureAuth, userAuthLogCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/user-auth-log/:usraulo_uuid`, ensureAuth, userAuthLogCtrl.deleteCtrl);
}

export default configureUserAuthLogRoutes;

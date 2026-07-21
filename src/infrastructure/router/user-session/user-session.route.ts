import { Express } from "express";
import { SequelizeUserSessionRepository } from "../../repository/user-session/sequelize-user-session.repository";
import { UserSessionUseCase } from "../../../application/user-session/user-session-use-case";
import { UserSessionController } from "../../controller/user-session/user-session.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureUserSessionRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeUserSessionRepo = new SequelizeUserSessionRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const userSessionUseCase = new UserSessionUseCase(sequelizeUserSessionRepo);
    
    /*
    *   Iniciar controller
    */
    const userSessionCtrl = new UserSessionController(userSessionUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/user-sessions`, ensureAuth, userSessionCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/user-sessions/user/:usr_uuid`, ensureAuth, userSessionCtrl.getByUserCtrl);
    app.get(`/${process.env.BASE_URL_API}/user-session/:usrs_uuid`, ensureAuth, userSessionCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/user-session`, ensureAuth, userSessionCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/user-session/:usrs_uuid`, ensureAuth, userSessionCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/user-session/:usrs_uuid`, ensureAuth, userSessionCtrl.deleteCtrl);
}

export default configureUserSessionRoutes;

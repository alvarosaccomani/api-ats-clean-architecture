import { Express } from "express";
import { SequelizeAuthRepository } from "../../repository/auth/sequelize-auth.repository";
import { AuthUseCase } from "../../../application/auth/auth-use-case";
import { AuthController } from "../../../infrastructure/controller/auth/auth.controller";
import SocketAdapter from "../../services/socketAdapter";

import { ensureAuth } from "../../middleware/auth.middleware";

function configureAuthRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    const sequelizeAuthRepository = new SequelizeAuthRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const authUseCase = new AuthUseCase(sequelizeAuthRepository);
    
    /*
    *   Iniciar controller
    */
    const authCtrl = new AuthController(authUseCase, socketAdapter);
    
    /*
    *   Registrar rutas
    */
    app.post(`/${process.env.BASE_URL_API}/login`, authCtrl.loginCtrl);
    app.post(`/${process.env.BASE_URL_API}/register`, authCtrl.registerCtrl);
    app.post(`/${process.env.BASE_URL_API}/confirm-account`, authCtrl.confirmCtrl);
    app.post(`/${process.env.BASE_URL_API}/forgot-password`, authCtrl.forgotCtrl);
    app.post(`/${process.env.BASE_URL_API}/reset-password`, authCtrl.resetCtrl);
    app.post(`/${process.env.BASE_URL_API}/user-nick-exist`, authCtrl.userNickExistCtrl);
    app.post(`/${process.env.BASE_URL_API}/user-email-exist`, authCtrl.userEmailExistCtrl);
    
    // SSO Endpoints
    app.post(`/${process.env.BASE_URL_API}/auth/sso/token`, ensureAuth, authCtrl.generateSSOTokenCtrl);
    app.post(`/${process.env.BASE_URL_API}/auth/sso/verify`, authCtrl.verifySSOTokenCtrl);
}

export default configureAuthRoutes;

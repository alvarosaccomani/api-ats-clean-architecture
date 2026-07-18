import { Express } from "express";
import { SequelizeRepository } from "../../repository/user/sequelize-user.repository";
import { UserUseCase } from "../../../application/user/user-use-case";
import { UserController } from "../../../infrastructure/controller/user/user.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureUserRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    const sequelizeUserRepository = new SequelizeRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const userUseCase = new UserUseCase(sequelizeUserRepository);
    
    /*
    *   Iniciar controller
    */
    const userCtrl = new UserController(userUseCase, socketAdapter);
    
    /*
    *   Registrar rutas
    */
    app.get(`/${process.env.BASE_URL_API}/users/:filter?/:page?/:perPage?`, userCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/user`, userCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.deleteCtrl);
}

export default configureUserRoutes;
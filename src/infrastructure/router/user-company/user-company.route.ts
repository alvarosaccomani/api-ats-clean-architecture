import { Express } from "express";
import { SequelizeUserCompanyRepository } from "../../repository/user-company/sequelize-user-company.repository";
import { UserCompanyUseCase } from "../../../application/user-company/user-company-use-case";
import { UserCompanyController } from "../../controller/user-company/user-company.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureUserCompanyRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeUserCompanyRepo = new SequelizeUserCompanyRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const userCompanyUseCase = new UserCompanyUseCase(sequelizeUserCompanyRepo);
    
    /*
    *   Iniciar controller
    */
    const userCompanyCtrl = new UserCompanyController(userCompanyUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/user-companies`, ensureAuth, userCompanyCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/user-companies/user/:usr_uuid`, ensureAuth, userCompanyCtrl.getByUserCtrl);
    app.get(`/${process.env.BASE_URL_API}/user-company/:usrcmp_uuid`, ensureAuth, userCompanyCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/user-company`, ensureAuth, userCompanyCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/user-company/:usrcmp_uuid`, ensureAuth, userCompanyCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/user-company/:usrcmp_uuid`, ensureAuth, userCompanyCtrl.deleteCtrl);
}

export default configureUserCompanyRoutes;

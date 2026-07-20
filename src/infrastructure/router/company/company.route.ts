import { Express } from "express";
import { SequelizeCompanyRepository } from "../../repository/company/sequelize-company.repository";
import { CompanyUseCase } from "../../../application/company/company-use-case";
import { CompanyController } from "../../controller/company/company.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureCompanyRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeCompanyRepo = new SequelizeCompanyRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const companyUseCase = new CompanyUseCase(sequelizeCompanyRepo);
    
    /*
    *   Iniciar controller
    */
    const companyCtrl = new CompanyController(companyUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/companies`, ensureAuth, companyCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/company/:cmp_uuid`, ensureAuth, companyCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/company`, ensureAuth, companyCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/company/:cmp_uuid`, ensureAuth, companyCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/company/:cmp_uuid`, ensureAuth, companyCtrl.deleteCtrl);
}

export default configureCompanyRoutes;

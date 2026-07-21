import { Express } from "express";
import { SequelizePlanRepository } from "../../repository/plan/sequelize-plan.repository";
import { PlanUseCase } from "../../../application/plan/plan-use-case";
import { PlanController } from "../../controller/plan/plan.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configurePlanRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizePlanRepo = new SequelizePlanRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const planUseCase = new PlanUseCase(sequelizePlanRepo);
    
    /*
    *   Iniciar controller
    */
    const planCtrl = new PlanController(planUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/plans`, ensureAuth, planCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/plan/:pla_uuid`, ensureAuth, planCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/plan`, ensureAuth, planCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/plan/:pla_uuid`, ensureAuth, planCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/plan/:pla_uuid`, ensureAuth, planCtrl.deleteCtrl);
}

export default configurePlanRoutes;

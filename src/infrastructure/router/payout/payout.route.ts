import { Express } from "express";
import { SequelizePayoutRepository } from "../../repository/payout/sequelize-payout.repository";
import { PayoutUseCase } from "../../../application/payout/payout-use-case";
import { PayoutController } from "../../controller/payout/payout.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configurePayoutRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizePayoutRepo = new SequelizePayoutRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const payoutUseCase = new PayoutUseCase(sequelizePayoutRepo);
    
    /*
    *   Iniciar controller
    */
    const payoutCtrl = new PayoutController(payoutUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/payouts`, ensureAuth, payoutCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/payouts/company/:cmp_uuid`, ensureAuth, payoutCtrl.getByCompanyCtrl);
    app.get(`/${process.env.BASE_URL_API}/payout/:pay_uuid`, ensureAuth, payoutCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/payout`, ensureAuth, payoutCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/payout/:pay_uuid`, ensureAuth, payoutCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/payout/:pay_uuid`, ensureAuth, payoutCtrl.deleteCtrl);
}

export default configurePayoutRoutes;

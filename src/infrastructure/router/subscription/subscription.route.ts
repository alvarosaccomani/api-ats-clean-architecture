import { Express } from "express";
import { SequelizeSubscriptionRepository } from "../../repository/subscription/sequelize-subscription.repository";
import { SubscriptionUseCase } from "../../../application/subscription/subscription-use-case";
import { SubscriptionController } from "../../controller/subscription/subscription.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureSubscriptionRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeSubscriptionRepo = new SequelizeSubscriptionRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const subscriptionUseCase = new SubscriptionUseCase(sequelizeSubscriptionRepo);
    
    /*
    *   Iniciar controller
    */
    const subscriptionCtrl = new SubscriptionController(subscriptionUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/subscriptions`, ensureAuth, subscriptionCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/subscriptions/subscriber/:type/:id`, ensureAuth, subscriptionCtrl.getBySubscriberCtrl);
    app.get(`/${process.env.BASE_URL_API}/subscription/:sub_uuid`, ensureAuth, subscriptionCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/subscription`, ensureAuth, subscriptionCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/subscription/:sub_uuid`, ensureAuth, subscriptionCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/subscription/:sub_uuid`, ensureAuth, subscriptionCtrl.deleteCtrl);
}

export default configureSubscriptionRoutes;

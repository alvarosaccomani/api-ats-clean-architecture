import { Express } from "express";
import { SequelizeSystemEventRepository } from "../../repository/system-event/sequelize-system-event.repository";
import { SystemEventUseCase } from "../../../application/system-event/system-event-use-case";
import { SystemEventController } from "../../controller/system-event/system-event.controller";
import { ensureAuth } from "../../middleware/auth.middleware";

function configureSystemEventRoutes(app: Express) {
    /*
    *   Iniciar repository
    */
    const sequelizeSystemEventRepo = new SequelizeSystemEventRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const systemEventUseCase = new SystemEventUseCase(sequelizeSystemEventRepo);
    
    /*
    *   Iniciar controller
    */
    const systemEventCtrl = new SystemEventController(systemEventUseCase);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/system-events`, ensureAuth, systemEventCtrl.getAllCtrl);
}

export default configureSystemEventRoutes;

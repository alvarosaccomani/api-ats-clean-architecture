import { Express } from "express";
import { RolController } from "../../controller/rol/rol.controller";

function configureRolRoutes(app: Express, socketAdapter?: any) {
    const controller = new RolController();
    
    app.get(`/${process.env.BASE_URL_API}/roles`, controller.getAllCtrl);
}

export default configureRolRoutes;

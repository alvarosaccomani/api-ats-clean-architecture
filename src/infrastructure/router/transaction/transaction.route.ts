import { Express } from "express";
import { SequelizeTransactionRepository } from "../../repository/transaction/sequelize-transaction.repository";
import { TransactionUseCase } from "../../../application/transaction/transaction-use-case";
import { TransactionController } from "../../controller/transaction/transaction.controller";
import { ensureAuth } from "../../middleware/auth.middleware";
import SocketAdapter from "../../services/socketAdapter";

function configureTransactionRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    const sequelizeTransactionRepo = new SequelizeTransactionRepository();
    
    /*
    *   Iniciar casos de uso
    */
    const transactionUseCase = new TransactionUseCase(sequelizeTransactionRepo);
    
    /*
    *   Iniciar controller
    */
    const transactionCtrl = new TransactionController(transactionUseCase, socketAdapter);
    
    /*
    *   Registrar rutas protegidas con ensureAuth
    */
    app.get(`/${process.env.BASE_URL_API}/transactions`, ensureAuth, transactionCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/transactions/subscriber/:type/:id`, ensureAuth, transactionCtrl.getBySubscriberCtrl);
    app.get(`/${process.env.BASE_URL_API}/transaction/:trn_uuid`, ensureAuth, transactionCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/transaction`, ensureAuth, transactionCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/transaction/:trn_uuid`, ensureAuth, transactionCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/transaction/:trn_uuid`, ensureAuth, transactionCtrl.deleteCtrl);
}

export default configureTransactionRoutes;

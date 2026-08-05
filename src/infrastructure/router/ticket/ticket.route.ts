import { Express } from "express";
import { SequelizeTicketRepository } from "../../repository/ticket/sequelize-ticket.repository";
import { TicketUseCase } from "../../../application/ticket/ticket-use-case";
import { TicketController } from "../../controller/ticket/ticket.controller";
import { ensureAuth } from "../../middleware/auth.middleware";
import SocketAdapter from "../../services/socketAdapter";

function configureTicketRoutes(app: Express, socketAdapter: SocketAdapter) {
    const ticketRepository = new SequelizeTicketRepository();
    const ticketUseCase = new TicketUseCase(ticketRepository);
    const ticketCtrl = new TicketController(ticketUseCase, socketAdapter);

    app.get(`/${process.env.BASE_URL_API}/tickets`, ensureAuth, ticketCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/tickets/my-tickets`, ensureAuth, ticketCtrl.getMyTicketsCtrl);
    app.get(`/${process.env.BASE_URL_API}/ticket/:tic_uuid`, ensureAuth, ticketCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/ticket`, ensureAuth, ticketCtrl.saveCtrl);
    app.put(`/${process.env.BASE_URL_API}/ticket/:tic_uuid`, ensureAuth, ticketCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/ticket/:tic_uuid`, ensureAuth, ticketCtrl.deleteCtrl);
}

export default configureTicketRoutes;

import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import { createServer } from 'http';
import initSocket from "./infrastructure/sockets/socketInit";
import configureSocketsEvents from "./infrastructure/sockets";
import configureExpressRoutes from "./infrastructure/router";


class Server {
    private app;
    private httpServer;
    private socketAdapter;


    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.socketAdapter = initSocket(this.httpServer);
        this.config();
        this.socketConfig();
        this.routerConfig();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
        this.app.use(cors());
    }

    private socketConfig() {
        configureSocketsEvents(this.socketAdapter);
    }

    private routerConfig() {
        configureExpressRoutes(this.app, this.socketAdapter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.httpServer.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;
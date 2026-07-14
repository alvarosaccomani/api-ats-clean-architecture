import { readdirSync } from "fs";
import { Express } from "express";
import SocketAdapter from "../services/socketAdapter";

const PATH_ROUTES = __dirname;

function removeExtension(fileName: string): string {
  const cleanFileName = <string>fileName.split(".").shift();
  return cleanFileName;
}

/**
 *
 * @param file tracks.ts
 */
function loadRouter(app: Express, socketAdapter: SocketAdapter, file: string): void {  
    const name = removeExtension(file);
    if (name !== "index" && name !== "") {
      import(`./${file}/${file}.route`)
        .then((routerModule) => {
          console.log("cargado", name);
          routerModule.default(app, socketAdapter)
         })
        .catch((err) => {
          console.info(err);
         });
    }
}
function configureExpressRoutes(app: Express, socketAdapter: SocketAdapter): void {
  readdirSync(PATH_ROUTES).filter( async (file) => loadRouter(app, socketAdapter, file));
}

export default configureExpressRoutes;
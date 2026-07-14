import { readdirSync } from "fs";
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
function loadRouter(socketAdapter: SocketAdapter, file: string): void {  
    const name = removeExtension(file);
    if (name !== "index" && name !== "socketInit" && name !== "") {
      import(`./${file}/${file}.socket`)
        .then((socket) => {
          console.log("cargado", name);
          socket.default(socketAdapter)
         })
        .catch((err) => {
          console.info(err);
         });
    }
}
function configureSocketsEvents(socketAdapter: SocketAdapter): void {
  readdirSync(PATH_ROUTES).filter( async (file) => loadRouter(socketAdapter, file));
}

export default configureSocketsEvents;
import { Server } from "http";
import { Server as SocketServer } from 'socket.io';
import SocketAdapter from '../services/socketAdapter';

function initSocket(server: Server): SocketAdapter {
  const socket = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  return new SocketAdapter(socket);
}

export default initSocket;
import { Server, Socket } from 'socket.io';

class SocketAdapter {
  private io: Server;

  constructor(server: Server) {
    this.io = server;
  }

  onConnection(callback: (socket: Socket) => void) {
    this.io.on('connection', (socket: Socket) => {
      callback(socket);
    });
  }

  emitEvent(eventName: string, data: any) {
    this.io.emit(eventName, data);
  }

}

export default SocketAdapter;
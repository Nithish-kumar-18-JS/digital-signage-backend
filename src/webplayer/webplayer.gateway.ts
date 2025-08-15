import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // allow all origins for now
  },
})
export class WebplayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('✅ Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('🔴 Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): any {
    console.log('📩 Received:', payload);
    return payload;
  }

  // send message to client
  sendMessageToAll(event: string, data: any) {
    this.server.emit(event, data); // send to all connected clients
  }

}

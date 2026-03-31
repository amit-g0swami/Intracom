import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat.service';
import { SendMessageDto } from '../dto/send-message.dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // In a real app, authorize JWT Token here and join them to their specific conversation room
    const conversationId = client.handshake.query['conversationId'] as string;
    if (conversationId) {
      client.join(`conversation_${conversationId}`);
      this.logger.log(`Socket ${client.id} joined conversation_${conversationId}`);
    } else {
      // Connect admins to an overarching 'admins' broadcast room
      const isAdmin = client.handshake.query['isAdmin'];
      if(isAdmin === 'true') {
        client.join('admin_dashboard');
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Thin Gateway Logic - delegates instantly to the generic Service layer
  @SubscribeMessage('send_message')
  async handleIncomingMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    // Calling application layer. No DB code lives in the gateway.
    await this.chatService.processIncomingMessage(payload);
  }

  // Method called globally by Event Handlers when a message needs to be pushed
  broadcastMessage(conversationId: string, payload: any) {
    // Broadcast back to the single conversation room (Visitor)
    this.server.to(`conversation_${conversationId}`).emit('new_message', payload);
    // Broadcast to the Dashboard Admins
    this.server.to('admin_dashboard').emit('admin_new_message', payload);
  }
}

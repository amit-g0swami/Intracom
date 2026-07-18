import { Logger, UnauthorizedException } from '@nestjs/common';
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
import type { SocketMessagePayload } from '@intracom/contracts';
import { SOCKET_EVENTS } from '@intracom/contracts';
import { AuthService } from '../../auth/auth.service';
import { loadFeatureFlags } from '../../config/features';
import { ChatService } from '../services/chat.service';
import { SendMessageDto } from '../dto/send-message.dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly features = loadFeatureFlags();

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    const conversationId = client.handshake.query['conversationId'] as string;

    if (conversationId) {
      client.join(`conversation_${conversationId}`);
      this.logger.log(`Socket ${client.id} joined conversation_${conversationId}`);
      return;
    }

    const isAdmin = client.handshake.query['isAdmin'] === 'true';

    if (!isAdmin) {
      return;
    }

    if (this.features.socketAuthEnabled) {
      const token =
        (client.handshake.auth?.token as string | undefined) ||
        (client.handshake.query['token'] as string | undefined);

      if (!token) {
        this.logger.warn(`Admin socket ${client.id} rejected — missing token`);
        client.disconnect(true);
        return;
      }

      try {
        const user = this.authService.verifyToken(token);
        client.data.user = user;
        client.join('admin_dashboard');
        this.logger.log(`Authenticated admin ${user.email} joined dashboard`);
      } catch {
        this.logger.warn(`Admin socket ${client.id} rejected — invalid token`);
        client.disconnect(true);
        return;
      }

      return;
    }

    client.join('admin_dashboard');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(SOCKET_EVENTS.SEND_MESSAGE)
  async handleIncomingMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    if (this.features.socketAuthEnabled && payload.isAdmin) {
      if (!client.data.user) {
        throw new UnauthorizedException('Admin socket is not authenticated');
      }
    }

    await this.chatService.processIncomingMessage(payload);
  }

  broadcastMessage(conversationId: string, payload: SocketMessagePayload) {
    this.server
      .to(`conversation_${conversationId}`)
      .emit(SOCKET_EVENTS.NEW_MESSAGE, payload);
    this.server
      .to('admin_dashboard')
      .emit(SOCKET_EVENTS.ADMIN_NEW_MESSAGE, payload);
  }
}

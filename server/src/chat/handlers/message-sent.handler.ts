import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatGateway } from '../gateways/chat.gateway';
import { MessageSentEvent } from '../events/message-sent.event';

/**
 * Handles internal application events and triggers side-effects like 
 * WebSockets broadcasting to connected clients.
 */
@Injectable()
export class MessageSentHandler {
  constructor(private readonly chatGateway: ChatGateway) {}

  @OnEvent('message.sent')
  handleMessageSent(event: MessageSentEvent) {
    // Since this runs in the context of the NestJS container, it triggers the gateway
    // If RedisAdapter is active, it pushes to all other instances automatically!
    this.chatGateway.broadcastMessage(event.conversationId, {
      id: event.messageId,
      text: event.text,
      senderId: event.senderId,
      isAdmin: event.isAdmin,
      conversationId: event.conversationId,
      timestamp: new Date().toISOString()
    });
  }
}

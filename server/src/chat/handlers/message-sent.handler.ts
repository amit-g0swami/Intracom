import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '@intracom/contracts';
import { ChatGateway } from '../gateways/chat.gateway';
import { MessageSentEvent } from '../events/message-sent.event';

/**
 * Handles internal application events and triggers side-effects like
 * WebSockets broadcasting to connected clients.
 */
@Injectable()
export class MessageSentHandler {
  constructor(private readonly chatGateway: ChatGateway) {}

  @OnEvent(DOMAIN_EVENTS.MESSAGE_SENT)
  handleMessageSent(event: MessageSentEvent) {
    this.chatGateway.broadcastMessage(event.conversationId, {
      id: event.messageId,
      text: event.text,
      senderId: event.senderId,
      isAdmin: event.isAdmin,
      conversationId: event.conversationId,
      timestamp: event.createdAt.toISOString(),
    });
  }
}

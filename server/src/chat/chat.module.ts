import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from './services/chat.service';
import { MessageRepository } from './repositories/message.repository';
import { MessageSentHandler } from './handlers/message-sent.handler';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    MessageRepository,
    MessageSentHandler,
  ],
})
export class ChatModule {}

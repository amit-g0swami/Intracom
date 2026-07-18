import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VisitorsModule } from '../visitors/visitors.module';
import { ChatController } from './controllers/chat.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { MessageSentHandler } from './handlers/message-sent.handler';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ChatService } from './services/chat.service';

@Module({
  imports: [AuthModule, VisitorsModule],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    ConversationRepository,
    MessageRepository,
    MessageSentHandler,
  ],
})
export class ChatModule {}

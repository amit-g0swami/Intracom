import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ChatModule } from '../chat/chat.module';
import { AiService } from './services/ai.service';
import { AiRouterService } from './services/ai-router.service';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { MessageSentAiHandler } from './handlers/message-sent-ai.handler';
import { AiProcessor } from './processors/ai.processor';

@Module({
  imports: [
    ChatModule,
    BullModule.registerQueue({
      name: 'ai',
    }),
  ],
  providers: [AiService, AiRouterService, KnowledgeBaseService, MessageSentAiHandler, AiProcessor],
})
export class AiModule {}

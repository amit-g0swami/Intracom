import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './processors/email.processor';
import { MessageSentEmailHandler } from './handlers/message-sent-email.handler';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailProcessor, MessageSentEmailHandler],
})
export class EmailModule {}

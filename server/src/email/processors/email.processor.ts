import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'new-message-email': {
        this.logger.log(`Processing new message email job: ${job.id}`);
        const { messageId, conversationId, text, isAdmin } = job.data;
        
        // In a real application, we would use an email provider like SendGrid or AWS SES here
        this.logger.log(`[Email Simulation] Sending email...`);
        this.logger.log(`[Email Simulation] Subject: New message in conversation ${conversationId}`);
        this.logger.log(`[Email Simulation] Body: "${text}"`);
        this.logger.log(`[Email Simulation] Sent by: ${isAdmin ? 'Admin' : 'Visitor'}`);
        
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        this.logger.log(`[Email Simulation] Email sent successfully!`);
        return { success: true, simulated: true };
      }
      
      default: {
        this.logger.warn(`Unknown job name: ${job.name}`);
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}

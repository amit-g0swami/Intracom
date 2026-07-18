import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import type { SendMessagePayload } from '@intracom/contracts';

export class SendMessageDto implements SendMessagePayload {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsString()
  appId?: string;

  @IsOptional()
  @IsString()
  visitorId?: string;

  @IsOptional()
  @IsObject()
  visitorAttributes?: Record<string, unknown>;
}

import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ChatService } from '../services/chat.service';
import { ListConversationsQueryDto } from '../dto/list-conversations-query.dto';
import {
  GetMessagesQueryDto,
  UpdateConversationStatusDto,
} from '../dto/update-conversation.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('status')
  getStatus() {
    return this.chatService.getStatus();
  }

  @Get()
  listConversations(@Query() query: ListConversationsQueryDto) {
    return this.chatService.listConversations(query);
  }

  @Get(':id')
  getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  @Get(':id/messages')
  getMessages(
    @Param('id') id: string,
    @Query() query: GetMessagesQueryDto,
  ) {
    return this.chatService.getConversationMessages(id, query.limit);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateConversationStatusDto,
  ) {
    return this.chatService.updateConversationStatus(id, body.status);
  }
}

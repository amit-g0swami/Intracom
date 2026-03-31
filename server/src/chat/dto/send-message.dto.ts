export class SendMessageDto {
  conversationId: string;
  senderId: string;
  text: string;
  isAdmin: boolean;
}

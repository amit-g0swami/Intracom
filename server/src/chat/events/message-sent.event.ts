export class MessageSentEvent {
  constructor(
    public readonly messageId: string,
    public readonly conversationId: string,
    public readonly text: string,
    public readonly senderId: string,
    public readonly isAdmin: boolean,
    public readonly createdAt: Date,
  ) {}
}

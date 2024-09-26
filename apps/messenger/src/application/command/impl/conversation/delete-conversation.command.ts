

export class DeleteConversationCommand {
    constructor(
      public readonly user: string,
      public readonly conversationId: string
    ) {}
}
  

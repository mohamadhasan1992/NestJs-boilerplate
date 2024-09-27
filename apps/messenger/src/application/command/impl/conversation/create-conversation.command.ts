import { CreateConversationDto } from "@shared/shared/dto/conversation";



export class CreateConversationCommand {
    constructor(
      public readonly user: string,
      public readonly createConversationDto: CreateConversationDto
    ) {}
}
  

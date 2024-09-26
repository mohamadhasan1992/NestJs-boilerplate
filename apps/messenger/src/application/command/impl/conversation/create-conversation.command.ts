import { CreateConversationDto } from "../../../dto/conversation/createConversation.dto";



export class CreateConversationCommand {
    constructor(
      public readonly user: string,
      public readonly createConversationDto: CreateConversationDto
    ) {}
}
  

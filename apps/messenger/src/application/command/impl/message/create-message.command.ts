import { CreateMessageDto } from "@shared/shared/dto/message";



export class CreateMessageCommand {
    constructor(
      public readonly user: string,
      public readonly createMessageDto: CreateMessageDto
    ) {}
}
  

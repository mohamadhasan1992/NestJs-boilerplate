import { CreateMessageDto } from "../../../dto/message/createMessage.dto";



export class CreateMessageCommand {
    constructor(
      public readonly user: string,
      public readonly createMessageDto: CreateMessageDto
    ) {}
}
  

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateMessageCommand } from '../../application/command/impl/message/create-message.command';
import { DeleteMessageCommand } from '../../application/command/impl/message/delete-message.command';
import { Payload } from '@nestjs/microservices';
import { CreateMessageDto } from '@shared/shared/dto/message';




@Controller('message')
export class MessageController {
  constructor(
    private readonly commandBus: CommandBus
  ) {}

  async createMessage(
    @Payload() {createMessageDto, userId}: {createMessageDto: CreateMessageDto, userId: string} 
  ){
    return await this.commandBus.execute(new CreateMessageCommand(userId, createMessageDto))
  }

  async deleteMessage(
    @Payload() {messageId, userId}: {messageId: string, userId: string} 
  ){
    return await this.commandBus.execute(new DeleteMessageCommand(messageId, userId))
  }
}
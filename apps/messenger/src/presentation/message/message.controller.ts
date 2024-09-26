import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUser, IAuthenticatedUser } from '@shared/shared';
import { CreateMessageDto } from '../../application/dto/message/createMessage.dto';
import { CreateMessageCommand } from '../../application/command/impl/message/create-message.command';
import { DeleteMessageCommand } from '../../application/command/impl/message/delete-message.command';




@Controller('message')
export class MessageController {
  constructor(
    private readonly commandBus: CommandBus
  ) {}

  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: IAuthenticatedUser
  ){
    return await this.commandBus.execute(new CreateMessageCommand(user._id, createMessageDto))
  }

  @Delete(":id")
  async deleteMessage(
    @Param("id") id: string,
    @CurrentUser() user: IAuthenticatedUser
  ){
    return await this.commandBus.execute(new DeleteMessageCommand(id, user._id))
  }
}
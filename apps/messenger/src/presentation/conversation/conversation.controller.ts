import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser, IAuthenticatedUser } from '@shared/shared';
import { CreateConversationDto } from '../../application/dto/conversation/createConversation.dto';
import { CreateConversationCommand } from '../../application/command/impl/conversation/create-conversation.command';
import { FilterQuery } from 'mongoose';
import { Message } from '../../domain/entities/message';
import { GetMessageQuery } from '../../application/query/impl/message/get-message-query';
import { ConversationSchema } from '../../infrustructure/schema/conversation.schema';
import { GetConversationQuery } from '../../application/query/impl/conversation/get-conversation-query';
import { DeleteConversationCommand } from '../../application/command/impl/conversation/delete-conversation.command';




@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async createConversation(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() createConversationDto: CreateConversationDto

  ){
    return await this.commandBus.execute(new CreateConversationCommand(user._id, createConversationDto))
  }
  
  @Get(":id/message")
  async listMessage(
    @Query() filterQuery: FilterQuery<Message>,
    @CurrentUser() user: IAuthenticatedUser,
    @Param("id") conversationId: string
  ){
    return await this.queryBus.execute(new GetMessageQuery(user._id, conversationId, filterQuery))    
  }

  @Get()
  async listConversation(
    @Query() filterQuery: FilterQuery<ConversationSchema>,
    @CurrentUser() user: IAuthenticatedUser,
  ){
    return await this.queryBus.execute(new GetConversationQuery(user._id, filterQuery))
  }


  @Delete(":id")
  async deleteConversation(
    @CurrentUser() user: IAuthenticatedUser,
    @Param("id") id: string
  ){
    return await this.commandBus.execute(new DeleteConversationCommand(user._id, id))
  }
}
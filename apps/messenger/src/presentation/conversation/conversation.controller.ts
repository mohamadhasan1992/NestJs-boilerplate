import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateConversationCommand } from '../../application/command/impl/conversation/create-conversation.command';
import { GetMessageQuery } from '../../application/query/impl/message/get-message-query';
import { GetConversationQuery } from '../../application/query/impl/conversation/get-conversation-query';
import { DeleteConversationCommand } from '../../application/command/impl/conversation/delete-conversation.command';
import { ConversationServiceController, ConversationServiceControllerMethods, FindConversationMessageRequest, FindConversationRequest } from '@shared/shared/proto/messenger';
import { Payload } from '@nestjs/microservices';
import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CreateConversationDto } from '@shared/shared/dto/conversation';



@Controller("conversation")
@ConversationServiceControllerMethods()
export class ConversationController implements ConversationServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async createConversation(
    @Payload() {createConversationDto, userId}: {createConversationDto: CreateConversationDto, userId: string},
  ){
    return await this.commandBus.execute(new CreateConversationCommand(userId, createConversationDto))
  }

  @Delete()
  async deleteConversation(
    @Payload() {conversationId, userId}: {conversationId: string, userId: string},
  ){
    return await this.commandBus.execute(new DeleteConversationCommand(userId, conversationId))
  }
  
  @Get(":id/message")
  async findConversationMessage(
    @Payload() {conversationId, limit, page, userId}: FindConversationMessageRequest
  ){
    return await this.queryBus.execute(new GetMessageQuery(userId, conversationId, {page, limit}))    
  }

  async findConversation(
    @Payload() {limit, page, userId}: FindConversationRequest
  ){
    return await this.queryBus.execute(new GetConversationQuery(userId, {page, limit}))
  }


}
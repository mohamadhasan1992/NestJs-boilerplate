import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateConversationCommand } from '../../application/command/impl/conversation/create-conversation.command';
import { GetMessageQuery } from '../../application/query/impl/message/get-message-query';
import { GetConversationQuery } from '../../application/query/impl/conversation/get-conversation-query';
import { DeleteConversationCommand } from '../../application/command/impl/conversation/delete-conversation.command';
import { ConversationServiceController, ConversationServiceControllerMethods, FindConversationMessageRequest, FindConversationMessageResponse, FindConversationRequest, FindConversationResponse } from '@shared/shared/proto/messenger';
import { Payload } from '@nestjs/microservices';
import { Controller, Get } from '@nestjs/common';
import { CreateConversationDto } from '@shared/shared/dto/conversation';



@Controller("conversation")
@ConversationServiceControllerMethods()
export class ConversationController implements ConversationServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createConversation(
    @Payload() {createConversationDto, userId}: {createConversationDto: CreateConversationDto, userId: string},
  ){
    return await this.commandBus.execute(new CreateConversationCommand(userId, createConversationDto))
  }

  async deleteConversation(
    @Payload() {conversationId, userId}: {conversationId: string, userId: string},
  ){
    return await this.commandBus.execute(new DeleteConversationCommand(userId, conversationId))
  }
  
  @Get(":id/message")
  async findConversationMessage(
    @Payload() {conversationId, limit, page, userId}: FindConversationMessageRequest
  ){
    const data = await this.queryBus.execute(new GetMessageQuery(userId, conversationId, {page, limit}))    
    console.log("findConversationMessage data",data)
    const response : FindConversationMessageResponse = data;
    return response
  }

  async findConversation(
    @Payload() {limit, page, userId}: FindConversationRequest
  ){
    const data = await this.queryBus.execute(new GetConversationQuery(userId, {page, limit}))
    console.log("findConversation data",data)
    const response : FindConversationResponse = data;
    return response
    }


}
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateConversationDto } from '../../application/dto/conversation/createConversation.dto';
import { CreateConversationCommand } from '../../application/command/impl/conversation/create-conversation.command';
import { GetMessageQuery } from '../../application/query/impl/message/get-message-query';
import { GetConversationQuery } from '../../application/query/impl/conversation/get-conversation-query';
import { DeleteConversationCommand } from '../../application/command/impl/conversation/delete-conversation.command';
import { ConversationServiceController, ConversationServiceControllerMethods, FindConversationMessageRequest, FindConversationRequest } from '@shared/shared/proto/messenger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';



@Controller("conversation")
@ConversationServiceControllerMethods()
export class ConversationController implements ConversationServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @MessagePattern('create-conversation')
  async createConversation(
    @Payload() {createConversationDto, userId}: {createConversationDto: CreateConversationDto, userId: string},
  ){
    return await this.commandBus.execute(new CreateConversationCommand(userId, createConversationDto))
  }

  @MessagePattern('delete-conversation')
  async deleteConversation(
    @Payload() {conversationId, userId}: {conversationId: string, userId: string},
  ){
    return await this.commandBus.execute(new DeleteConversationCommand(userId, conversationId))
  }
  
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
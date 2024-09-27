import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateConversationDto } from '../../../../../libs/shared/src/dto/conversation/createConversation.dto';
import { CONVERSATION_SERVICE_NAME, ConversationServiceClient, FindConversationMessageRequest, FindConversationRequest } from '@shared/shared/proto/messenger';
import { FilterQuery } from 'mongoose';
import { ApiGatewayMessengerKafkaService } from '../messaging/gateway-messenger-kafka.service';
import { ConversationActionEnum } from '@shared/shared/enum';



@Injectable()
export class ConversationService implements OnModuleInit {
  private conversationService: ConversationServiceClient

  constructor(
    @Inject("GRPC_MESSENGER_SERVICE") private client: ClientGrpc,
    private readonly kafkaService: ApiGatewayMessengerKafkaService
  ){}

  onModuleInit() {
    this.conversationService = this.client.getService<ConversationServiceClient>(CONVERSATION_SERVICE_NAME)
  }

  // call kafka
  async create(createConversationDto: CreateConversationDto, userId: string) {
    return await this.kafkaService.sendRequestToMessengerService({
      ...createConversationDto,
      userId,
      action: ConversationActionEnum.CreateConversation
    });
  }

  
  async remove(conversationId: string, userId: string) {
    return await this.kafkaService.sendRequestToMessengerService({
      conversationId,
      userId,
      action: ConversationActionEnum.DeleteConversation
    });

  }

  // call grpc
  async findConversationMessage({page, limit}: FilterQuery<any>, userId: string, conversationId: string){
    const findConversationMessageRequest : FindConversationMessageRequest = {
      conversationId,
      userId,
      limit,
      page
    }
    return this.conversationService.findConversationMessage(findConversationMessageRequest)
  }

  // calling grpc
  async find({page, limit}: FilterQuery<any>, userId: string){
    const findConversationRequest : FindConversationRequest = {
      limit,
      page,
      userId
    }
    return this.conversationService.findConversation(findConversationRequest)
  }

  
}

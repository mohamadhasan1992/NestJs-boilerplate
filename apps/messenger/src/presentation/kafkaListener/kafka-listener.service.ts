import { Injectable } from '@nestjs/common';
import { KafkaService } from '@shared/shared/messaging/kafka-streaming.service';
import { KafkaTopics } from '@shared/shared';
import { CommandBus } from '@nestjs/cqrs';
import {  ConversationActionEnum } from '@shared/shared/enum';
import { CreateConversationCommand } from '../../application/command/impl/conversation/create-conversation.command';
import { CreateConversationDto } from '@shared/shared/dto/conversation';
import { CreateMessageCommand } from '../../application/command/impl/message/create-message.command';
import { CreateMessageDto } from '@shared/shared/dto/message';
import { DeleteConversationCommand } from '../../application/command/impl/conversation/delete-conversation.command';
import { DeleteMessageCommand } from '../../application/command/impl/message/delete-message.command';

@Injectable()
export class MessengerKafkaService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly commandBus: CommandBus,
) {
    this.kafkaService.createConsumer(
      'messenger-group', // consumer group
      KafkaTopics.KafkaMessengerRequestTopic, // topic to listen to
      async (payload) => {
        const { value } = payload.message;
        const request = JSON.parse(value.toString());
        
        // Process the request
        const correlationId = request.correlationId;
        const userData = await this.handleAuthRequest(request);

        // Send response back to the api-gateway
        await this.sendResponseToApiGateway(userData, correlationId);
      }
    );
  }

  private async handleAuthRequest(request: any): Promise<any> {
    let response;
    console.log("request from kafka", request)
    switch (request.action) {
        case ConversationActionEnum.CreateConversation:
          const createConversationDto : CreateConversationDto = {
            content: request.content,
            recipient: request.recipient
          }
          response = await this.commandBus.execute(new CreateConversationCommand(request.userId, createConversationDto))
          break;
        case ConversationActionEnum.CreateMessage:
          const createMessageDto : CreateMessageDto = {
                content: request.content,
                conversation: request.conversation
            }
            response = await this.commandBus.execute(new CreateMessageCommand(request.user, createMessageDto))
            break;
        case ConversationActionEnum.DeleteConversation:
            response = await this.commandBus.execute(new DeleteConversationCommand(request.userId, request.conversationId))
            break;
        case ConversationActionEnum.DeleteMessage:
          response = await this.commandBus.execute(new DeleteMessageCommand(request.messageId, request.user))
          break;
      default:
            break;
    }
    return response
  }

  private async sendResponseToApiGateway(userData: any, correlationId: string) {
    const response = { ...userData, correlationId };

    // Send the response to the KafkaAuthenticationResponseTopic
    await this.kafkaService.sendMessage(KafkaTopics.KafkaMessengerResponseTopic, [response]);
  }
}

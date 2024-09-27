import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../../../../../libs/shared/src/dto/message/createMessage.dto';
import { ApiGatewayMessengerKafkaService } from '../messaging/gateway-messenger-kafka.service';
import { ConversationActionEnum } from '@shared/shared/enum';




@Injectable()
export class MessageService {
  constructor(
    private readonly kafkaService: ApiGatewayMessengerKafkaService
  ){}



  async create(createMessageDto: CreateMessageDto, userId: string) {
    const {success, data, message} = await this.kafkaService.sendRequestToMessengerService({
      ...createMessageDto,
      userId,
      action: ConversationActionEnum.CreateMessage
    });

    return {
      success,
      data,
      message
    }
  }


  async remove(messageId: string, userId: string) {
    const {success, data, message} = await this.kafkaService.sendRequestToMessengerService({
      messageId,
      userId,
      action: ConversationActionEnum.DeleteMessage
    });

    return {
      success,
      data,
      message
    }
  }
}

import { Injectable } from '@nestjs/common';
import { KafkaTopics } from '@shared/shared';
import { KafkaService } from '@shared/shared/messaging/kafka-streaming.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiGatewayAuthKafkaService {
  private pendingResponses: Map<string, any> = new Map();

  constructor(private readonly kafkaService: KafkaService) {
    // Initialize response listener
    this.kafkaService.createConsumer(
      'api-gateway-group', 
      KafkaTopics.KafkaAuthenticationResponseTopic, 
      async (payload) => {
        const { value } = payload.message;
        const response = JSON.parse(value.toString());
        const correlationId = response.correlationId;
        if (this.pendingResponses.has(correlationId)) {
          this.pendingResponses.get(correlationId).resolve(response);
          this.pendingResponses.delete(correlationId);
        }
      });
  }

  async sendRequestToAuthService(data: any): Promise<any> {
    const correlationId = uuidv4();
    const responsePromise = new Promise((resolve, reject) => {
      this.pendingResponses.set(correlationId, { resolve, reject });
    });
    console.log("kafka service", [{ ...data, correlationId }])
    await this.kafkaService.sendMessage(KafkaTopics.KafkaAuthenticationRequestTopic, [{ ...data, correlationId }]);
    
    // Handle timeout
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
    return Promise.race([responsePromise, timeoutPromise]);
  }
}

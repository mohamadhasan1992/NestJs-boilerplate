import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Producer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService {
  private producer: Producer;
  
  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: Kafka) {
    this.producer = this.kafka.producer();
    this.producer.connect();
  }

  async sendMessage(topic: string, messages: any[]): Promise<void> {
    await this.producer.send({
      topic,
      messages: messages.map((message) => ({ value: JSON.stringify(message) })),
    });
  }

  async createConsumer(
    groupId: string,
    topic: string,
    messageHandler: (payload: EachMessagePayload) => Promise<void>
  ) {
    const consumer = this.kafka.consumer({ groupId });
  
    // Connect to the Kafka broker
    await consumer.connect();
  
    // Subscribe to the given topic
    await consumer.subscribe({ topic, fromBeginning: true });
  
    // Run the consumer and handle each message
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          // Process the message using the provided handler
          await messageHandler(payload);
  
          // Ensure consumer is defined before committing offsets
          if (consumer) {
            await consumer.commitOffsets([
              { topic: payload.topic, partition: payload.partition, offset: String(Number(payload.message.offset) + 1) },
            ]);
          } else {
            console.error('Consumer is undefined, cannot commit offsets.');
          }
        } catch (error) {
          console.error('Error processing message:', error);
          // You can add further error handling logic here, such as retries or logging to an error tracking system
        }
      },
    });
  }
  
}

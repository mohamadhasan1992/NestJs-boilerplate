import { ClientOptions, Transport } from '@nestjs/microservices';


export const gatewayKafkaProducerOptions: ClientOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'gateway',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'gateway-producer', 
      },
    },
  };

export const userKafkaConsumerOptions: ClientOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user-management',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'user-management-consumer',
      },
    },
};
export const messengerkafkaConsumerOptions: ClientOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'messenger',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'messenger-consumer',
      },
    },
};

export enum KafkaTopics{
  KafkaAuthenticationRequestTopic = "auth.request",   
  KafkaAuthenticationResponseTopic = "auth.response",   
  KafkaMessengerRequestTopic = "messenger.request",   
  KafkaMessengerResponseTopic = "messenger.response",   
}


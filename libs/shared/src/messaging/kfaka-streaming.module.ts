import { DynamicModule, Global, Module } from '@nestjs/common';
import { Kafka, KafkaConfig } from 'kafkajs';
import { KafkaService } from './kafka-streaming.service';


@Global()
@Module({})
export class KafkaModule {
  static forRoot(config: KafkaConfig): DynamicModule {
    const kafkaProvider = {
      provide: 'KAFKA_CLIENT',
      useFactory: () => new Kafka(config),
    };

    return {
      module: KafkaModule,
      providers: [kafkaProvider, KafkaService],
      exports: [kafkaProvider, KafkaService],
    };
  }
}

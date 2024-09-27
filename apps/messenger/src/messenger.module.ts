import { Module } from '@nestjs/common';
import { DatabaseModule, EnvironmentConfigModule, LoggerModule } from '@shared/shared';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '@shared/shared/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import { BcryptService } from '@shared/shared/bcrypt/bcrypt.service';
import { SchemaFactory } from '@nestjs/mongoose';
import { ConversationSchema } from './infrustructure/schema/conversation.schema';
import { MessageSchema } from './infrustructure/schema/message.schema';
import { AllControllers } from './presentation';
import { ConversationEntityRepository } from './infrustructure/repositories/conversation-entity.repository';
import { MessageEntityRepository } from './infrustructure/repositories/message-entity.repository';
import { ConversationSchemaFactory } from './infrustructure/schema-factory/conversation-schema.factory';
import { MessageSchemaFactory } from './infrustructure/schema-factory/message-schema.factory';
import { MessageEntityFactory } from './domain/entityFactories/MessageEntity.factory';
import { ConversationEntityFactory } from './domain/entityFactories/ConversationEntity.factory';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { JwtModule } from '@nestjs/jwt';
import { MessengerKafkaService } from './presentation/kafkaListener/kafka-listener.service';
import { KafkaModule } from '@shared/shared/messaging/kfaka-streaming.module';




@Module({
  imports: [
    EnvironmentConfigModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: "Conversation",
        schema: SchemaFactory.createForClass(ConversationSchema)
      },
      {
        name: "Message",
        schema: SchemaFactory.createForClass(MessageSchema)
      }
    ]),
    KafkaModule.forRoot({
      clientId: 'messenger',
      brokers: ['kafka:9092'],
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    CacheModule.registerAsync(RedisOptions),
    LoggerModule,
    CqrsModule,
  ],
  controllers: AllControllers,
  providers: [
    {provide: "LoggerService", useClass: LoggerService},
    {provide: "EnvironmentConfigService", useClass: EnvironmentConfigService},
    {provide: "BcryptService", useClass: BcryptService},
    {provide: "ConversationRepository", useClass: ConversationEntityRepository},
    {provide: "MessageRepository", useClass: MessageEntityRepository},
    {provide: "ConversationSchemaFactory", useClass: ConversationSchemaFactory},
    {provide: "MessageSchemaFactory", useClass: MessageSchemaFactory},
    MessageEntityFactory,
    ConversationEntityFactory,
    MessengerKafkaService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers
  ],
})
export class MessengerModule {}

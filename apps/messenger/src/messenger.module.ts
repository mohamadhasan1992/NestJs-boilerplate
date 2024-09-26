import { Module } from '@nestjs/common';
import { JwtModule as JwtServiceModule, BcryptModule, DatabaseModule, EnvironmentConfigModule, LoggerModule } from '@shared/shared';
import { validate } from './infrustructure/config/environment-config.validation';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '@shared/shared/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { JwtTokenService } from '@shared/shared/jwt/jwt.service';
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




@Module({
  imports: [
    EnvironmentConfigModule.forRoot(`./env/${process.env.NODE_ENV}.env`, validate),
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
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),
    CacheModule.registerAsync(RedisOptions),
    LoggerModule,
    BcryptModule,
    JwtServiceModule,
    CqrsModule,
  ],
  controllers: AllControllers,
  providers: [
    {provide: "LoggerService", useClass: LoggerService},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "ConfigService", useClass: EnvironmentConfigService},
    {provide: "BcryptService", useClass: BcryptService},
    {provide: "ConversationRepository", useClass: ConversationEntityRepository},
    {provide: "MessageRepository", useClass: MessageEntityRepository},
    {provide: "ConversationSchemaFactory", useClass: ConversationSchemaFactory},
    {provide: "MessageSchemaFactory", useClass: MessageSchemaFactory},
    MessageEntityFactory,
    ConversationEntityFactory,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers
  ],
})
export class MessengerModule {}

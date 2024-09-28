import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthService } from './application/services/auth.service';
import { ConversationService } from './application/services/conversation.service';
import { MessageService } from './application/services/message.service';
import { grpcMessengerOptions, grpcUserOptions } from '@shared/shared/grpcOptions';
import { KafkaModule } from '@shared/shared/messaging/kfaka-streaming.module';
import { ApiGatewayMessengerKafkaService } from './application/messaging/gateway-messenger-kafka.service';
import { ApiGatewayAuthKafkaService } from './application/messaging/gateway-auth-kafka.service';
import { AuthStrategies } from './presentation/strategies';
import { CacheModule } from '@nestjs/cache-manager';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BcryptModule, LoggerModule,JwtModule as JwtServiceModule, EnvironmentConfigModule } from '@shared/shared';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { RedisOptions } from '@shared/shared/redis/redis.module';
import { JwtTokenService } from '@shared/shared/jwt/jwt.service';
import { BcryptService } from '@shared/shared/bcrypt/bcrypt.service';
import { AllControllers } from './presentation/controllers';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
// import { validate } from './infrustructure/config/environment-config.validation';



@Module({
  imports: [
    EnvironmentConfigModule,
    ClientsModule.register([
      { name: 'GRPC_USER_MANAGEMENT_SERVICE', ...grpcUserOptions },
      { name: 'GRPC_MESSENGER_SERVICE', ...grpcMessengerOptions },
    ]),
    KafkaModule.forRoot({
      clientId: 'api-gateway',
      brokers: ['kafka:9092'],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, './i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),
    CacheModule.registerAsync(RedisOptions),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    LoggerModule,
    BcryptModule,
    JwtServiceModule,
  ],
  controllers: AllControllers,
  providers: [
    {provide: "LoggerService", useClass: LoggerService},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "EnvironmentConfigService", useClass: EnvironmentConfigService},
    {provide: "BcryptService", useClass: BcryptService},
    AuthService, 
    ConversationService, 
    MessageService,
    ApiGatewayAuthKafkaService,
    ApiGatewayMessengerKafkaService,
    ...AuthStrategies,
  ],
})
export class GatewayModule {}

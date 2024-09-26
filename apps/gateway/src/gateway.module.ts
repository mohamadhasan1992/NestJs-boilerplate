import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { ConversationController } from './presentation/controllers/conversation.controller';
import { MessageController } from './presentation/controllers/message.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { ClientsModule } from '@nestjs/microservices';
import { AuthService } from './application/services/auth.service';
import { ConversationService } from './application/services/conversation.service';
import { MessageService } from './application/services/message.service';
import { grpcMessengerOptions, grpcUserOptions } from '@shared/shared/grpcOptions';
import { KafkaModule } from '@shared/shared/messaging/kfaka-streaming.module';
import { ApiGatewayMessengerKafkaService } from './application/messaging/gateway-messenger-kafka.service';
import { ApiGatewayAuthKafkaService } from './application/messaging/gateway-auth-kafka.service';
import { AuthStrategies } from './presentation/strategies';



@Module({
  imports: [
    ClientsModule.register([
      { name: 'GRPC_USER_MANAGEMENT_SERVICE', ...grpcUserOptions },
      { name: 'GRPC_MESSENGER_SERVICE', ...grpcMessengerOptions },
    ]),
    KafkaModule.forRoot({
      clientId: 'api-gateway',
      brokers: ['kafka:9092'],
    })
  ],
  controllers: [
    AuthController,
    ConversationController,
    MessageController,
    HealthController
  ],
  providers: [
    AuthService, 
    ConversationService, 
    MessageService,
    ApiGatewayAuthKafkaService,
    ApiGatewayMessengerKafkaService,
    ...AuthStrategies,
  ],
})
export class GatewayModule {}

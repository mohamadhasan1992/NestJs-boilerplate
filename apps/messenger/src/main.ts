import { NestFactory } from '@nestjs/core';
import { MessengerModule } from './messenger.module';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter, LoggingInterceptor, messengerkafkaConsumerOptions } from '@shared/shared';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcMessengerOptions } from '@shared/shared/grpcOptions';



async function bootstrap() {
  const app = await NestFactory.create(MessengerModule);
  
    // Kafka Microservice for commands
    app.connectMicroservice<MicroserviceOptions>(messengerkafkaConsumerOptions);
    // gRPC Microservice for queries
    app.connectMicroservice<MicroserviceOptions>(grpcMessengerOptions);
  
  
  // app.use(cookieParser());

  // Filter
  app.useGlobalFilters(
    new AllExceptionFilter(new LoggerService()),
  );

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({whitelist: true})
  );

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  await app.startAllMicroservices();
  await app.listen(4000)
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { MessengerModule } from './messenger.module';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter, LoggingInterceptor, messengerkafkaConsumerOptions } from '@shared/shared';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcMessengerOptions } from '@shared/shared/grpcOptions';



async function bootstrap() {
  const app = await NestFactory.create(MessengerModule);
  
    // Kafka Microservice for commands
    app.connectMicroservice<MicroserviceOptions>(messengerkafkaConsumerOptions);
    // gRPC Microservice for queries
    app.connectMicroservice<MicroserviceOptions>(grpcMessengerOptions);
  
  
  app.use(cookieParser());

  // Filter
  app.useGlobalFilters(
    new AllExceptionFilter(new LoggerService()),
    new I18nValidationExceptionFilter({}), 
  );

  // pipes
  app.useGlobalPipes(
    new I18nValidationPipe(),
    new ValidationPipe({whitelist: true})
  );

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  await app.startAllMicroservices();
  
  const port = app.get(EnvironmentConfigService).getHttpPort() 
  await app.listen(port);
}
bootstrap();

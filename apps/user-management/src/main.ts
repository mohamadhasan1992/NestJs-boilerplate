import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from '../../../libs/shared/src/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter, LoggingInterceptor, userKafkaConsumerOptions } from '@shared/shared';
import { MicroserviceOptions} from '@nestjs/microservices';
import { grpcUserOptions } from '@shared/shared/grpcOptions';





async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kafka Microservice for commands
  app.connectMicroservice<MicroserviceOptions>(userKafkaConsumerOptions);
  // gRPC Microservice for queries
  app.connectMicroservice<MicroserviceOptions>(grpcUserOptions);

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
  await app.listen(3000)

}


bootstrap();

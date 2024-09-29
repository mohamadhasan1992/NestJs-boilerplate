import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from './infrustructure/logger/logger.service';
import { AllExceptionFilter } from './presentation/filter/exception.filter';
import { LoggingInterceptor } from './presentation/interceptors/logger.interceptor';





async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

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

  
  // base routing
  app.setGlobalPrefix('api/v1');

  
  await app.listen(3000);
}


bootstrap();

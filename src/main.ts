import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from './infrustructure/logger/logger.service';
import { AllExceptionFilter } from './infrustructure/filter/exception.filter';
import { LoggingInterceptor } from './infrustructure/interceptors/logger.interceptor';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';





async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  
  // base routing
  app.setGlobalPrefix('api/v1');

  
  await app.listen(3000);
}


bootstrap();

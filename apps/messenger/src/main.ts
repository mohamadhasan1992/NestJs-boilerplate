import { NestFactory } from '@nestjs/core';
import { MessengerModule } from './messenger.module';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter, LoggingInterceptor } from '@shared/shared';



async function bootstrap() {
  const app = await NestFactory.create(MessengerModule);
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

  await app.listen(process.env.PORT);
}
bootstrap();

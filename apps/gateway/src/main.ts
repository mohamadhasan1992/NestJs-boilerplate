import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter, LoggingInterceptor } from '@shared/shared';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
// import { WebsocketAdapter } from './sgateway/gateway.adapter';


async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  
  app.use(cookieParser());

  // WEBSOCKET
  // const adapter = new WebsocketAdapter(app);
  // app.useWebSocketAdapter(adapter);


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
  const port = app.get(EnvironmentConfigService).getHttpPort() 
  await app.listen(port);

}
bootstrap();

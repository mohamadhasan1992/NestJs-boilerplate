import { NestFactory } from '@nestjs/core';
import { GatewayModule } from 'apps/gateway/src/gateway.module';
import { WebsocketAdapter } from './gateway/gateway.adapter';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.use(cookieParser());
  // WEBSOCKET
  const adapter = new WebsocketAdapter(app);
  app.useWebSocketAdapter(adapter);

  const environmentService = app.get(EnvironmentConfigService);
  await app.listen(environmentService.getHttpPort());
}
bootstrap();

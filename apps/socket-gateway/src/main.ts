import { NestFactory } from '@nestjs/core';
import { WebsocketAdapter } from './gateway/gateway.adapter';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import * as cookieParser from 'cookie-parser';
import { SocketGatewayModule } from './socket-gateway.module';


async function bootstrap() {
  const app = await NestFactory.create(SocketGatewayModule);

  app.use(cookieParser());
  // WEBSOCKET
  const adapter = new WebsocketAdapter(app);
  app.useWebSocketAdapter(adapter);

  const environmentService = app.get(EnvironmentConfigService);
  await app.listen(environmentService.getHttpPort());
}
bootstrap();

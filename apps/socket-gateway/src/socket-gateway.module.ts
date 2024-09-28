import { Module } from '@nestjs/common';
import { Gateway } from './gateway/gateway';
import { GatewaySessionManager } from './gateway/gateway.session';
import { EnvironmentConfigModule, LoggerModule } from '@shared/shared';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '@shared/shared/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './gateway/authentication.service';
import { ClientsModule } from '@nestjs/microservices';
import { grpcUserOptions } from '@shared/shared/grpcOptions';
import { JwtModule as JwtTokenModule } from '@shared/shared/jwt/jwt.module';
import { JwtTokenService } from '@shared/shared/jwt/jwt.service';



@Module({
  imports: [
    EnvironmentConfigModule,
    CacheModule.registerAsync(RedisOptions),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    LoggerModule,
    ClientsModule.register([
      { name: 'GRPC_USER_MANAGEMENT_SERVICE', ...grpcUserOptions },
    ]),
    JwtTokenModule

  ],
  providers: [
    AuthenticationService,
    Gateway,
    {provide: "JwtTokenService", useClass: JwtTokenService},
    {
      provide: "GATEWAY_SESSION_MANAGER",
      useClass: GatewaySessionManager,
    },
  ]
})
export class SocketGatewayModule {}


import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../../../apps/user-management/src/domain/adapters/database.interface';
import { JWTConfig } from '../../../../apps/user-management/src/domain/adapters/jwt.interface';


@Injectable()
export class EnvironmentConfigService implements DatabaseConfig, JWTConfig {
  constructor(private configService: ConfigService) {}
  getHttpPort(): string{
    return this.configService.get<string>('HTTP_PORT');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('MONGO_URI');
  }


  getRedisHost(): string {
    console.log("getRedisHost")
    return this.configService.get<string>('REDIS_HOST');
  }

  getRedisPort(): number {
    console.log("getRedisPort")
    return this.configService.get<number>('REDISE_PORT');
  }

}

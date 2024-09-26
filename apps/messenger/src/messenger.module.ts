import { Module } from '@nestjs/common';
import { JwtModule as JwtServiceModule, BcryptModule, DatabaseModule, EnvironmentConfigModule, LoggerModule } from '@shared/shared';
import { validate } from './infrustructure/config/environment-config.validation';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '@shared/shared/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { JwtTokenService } from '@shared/shared/jwt/jwt.service';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import { BcryptService } from '@shared/shared/bcrypt/bcrypt.service';




@Module({
  imports: [
    EnvironmentConfigModule.forRoot(`./env/${process.env.NODE_ENV}.env`, validate),
    DatabaseModule,
    DatabaseModule.forFeature([
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),
    CacheModule.registerAsync(RedisOptions),
    LoggerModule,
    BcryptModule,
    JwtServiceModule,
    CqrsModule,
  ],
  controllers: [],
  providers: [
    {provide: "LoggerService", useClass: LoggerService},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "ConfigService", useClass: EnvironmentConfigService},
    {provide: "BcryptService", useClass: BcryptService},
  ],
})
export class MessengerModule {}

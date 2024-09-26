import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from "path";
import { CacheModule } from '@nestjs/cache-manager';
import { AllControllers } from './presentation';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEntityRepository } from './infrustructure/repositories/user-entity.repository';
import { UserSchemaFactory } from './infrustructure/schema-factory/user-schema.factory';
import { UserEntityFactory } from './domain/entityFactories/UserEntity.factory';
import { AuthStrategies } from './presentation/strategies';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { SchemaFactory } from '@nestjs/mongoose';
import { UserSchema } from './infrustructure/schema/user.schema';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { validate } from './infrustructure/config/environment-config.validation';
import { JwtModule as JwtServiceModule, BcryptModule, DatabaseModule, EnvironmentConfigModule, LoggerModule } from '@shared/shared';
import { RedisOptions } from '@shared/shared/redis/redis.module';
import { JwtTokenService } from '@shared/shared/jwt/jwt.service';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import { BcryptService } from '@shared/shared/bcrypt/bcrypt.service';





@Module({
  imports: [
    EnvironmentConfigModule.forRoot(`./env/${process.env.NODE_ENV}.env`, validate),
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: "User",
        schema: SchemaFactory.createForClass(UserSchema)
      }
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
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    LoggerModule,
    BcryptModule,
    JwtServiceModule
    ,
    CqrsModule,

  ],
  controllers: AllControllers,
  providers: [
    {provide: "UserRepository", useClass: UserEntityRepository},
    {provide: "LoggerService", useClass: LoggerService},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "ConfigService", useClass: EnvironmentConfigService},
    {provide: "BcryptService", useClass: BcryptService},
    UserSchemaFactory,
    UserEntityFactory,
    ...AuthStrategies,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers


  ],
})
export class AppModule {}


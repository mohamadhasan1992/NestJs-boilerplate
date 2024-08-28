import { Module } from '@nestjs/common';
import { BcryptModule } from './infrustructure/services/bcrypt/bcrypt.module';
import { PassportModule } from '@nestjs/passport';
import { EnvironmentConfigModule } from './infrustructure/config/environment-config.module';
import { JwtModule as JwtServiceModule } from './infrustructure/services/jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './infrustructure/logger/logger.module';
import { DatabaseModule } from './infrustructure/database/database.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from "path";
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './infrustructure/redis/redis.module';
import { WhatsAppModule } from './infrustructure/whatspp/whatsapp.module';
import { AllControllers } from './presentation';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEntityRepository } from './infrustructure/repositories/user-entity.repository';
import { JwtTokenService } from './infrustructure/services/jwt/jwt.service';
import { EnvironmentConfigService } from './infrustructure/config/environment-config.service';
import { BcryptService } from './infrustructure/services/bcrypt/bcrypt.service';
import { UserSchemaFactory } from './infrustructure/schema-factory/user-schema.factory';
import { UserEntityFactory } from './domain/entityFactories/UserEntity.factory';
import { AuthStrategies } from './application/strategies';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { SchemaFactory } from '@nestjs/mongoose';
import { UserSchema } from './infrustructure/schema/user.schema';
import { PropertySchema } from './infrustructure/schema/property.schema';





@Module({
  imports: [
    EnvironmentConfigModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: "User",
        schema: SchemaFactory.createForClass(UserSchema)
      },
      {
        name: "Property",
        schema: SchemaFactory.createForClass(PropertySchema)
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
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
    WhatsAppModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    LoggerModule,
    BcryptModule,
    JwtServiceModule,
    CqrsModule,

  ],
  controllers: AllControllers,
  providers: [
    {provide: "UserRepository", useClass: UserEntityRepository},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "JwtConfig", useClass: EnvironmentConfigService},
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


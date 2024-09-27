import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { AllControllers } from './presentation';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEntityRepository } from './infrustructure/repositories/user-entity.repository';
import { UserSchemaFactory } from './infrustructure/schema-factory/user-schema.factory';
import { UserEntityFactory } from './domain/entityFactories/UserEntity.factory';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { SchemaFactory } from '@nestjs/mongoose';
import { UserSchema } from './infrustructure/schema/user.schema';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { JwtModule as JwtServiceModule, BcryptModule, DatabaseModule, EnvironmentConfigModule, LoggerModule } from '@shared/shared';
import { RedisOptions } from '@shared/shared/redis/redis.module';
import { JwtTokenService } from '@shared/shared/jwt/jwt.service';
import { EnvironmentConfigService } from '@shared/shared/config/environment-config.service';
import { BcryptService } from '@shared/shared/bcrypt/bcrypt.service';
import { UserManagementKafkaService } from './presentation/auth/kafka-listener.service';
import { KafkaModule } from '@shared/shared/messaging/kfaka-streaming.module';
import { CommandHandlers } from './application/command';





@Module({
  imports: [
    EnvironmentConfigModule,
    DatabaseModule,
    KafkaModule.forRoot({
      clientId: 'user-management',
      brokers: ['kafka:9092'],
    }),
    DatabaseModule.forFeature([
      {
        name: "User",
        schema: SchemaFactory.createForClass(UserSchema)
      }
    ]),
    CacheModule.registerAsync(RedisOptions),
    PassportModule,
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
    {provide: "LoggerService", useClass: LoggerService},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "EnvironmentConfigService", useClass: EnvironmentConfigService},
    {provide: "UserRepository", useClass: UserEntityRepository},
    {provide: "BcryptService", useClass: BcryptService},
    {provide: "UserSchemaFactory", useClass: UserSchemaFactory},
    UserEntityFactory,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UserManagementKafkaService,

  ],
})
export class AppModule {}


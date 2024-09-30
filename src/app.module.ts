import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { BcryptModule, DatabaseModule, EnvironmentConfigModule, LoggerModule, RedisOptions } from './shared';





@Module({
  imports: [
    EnvironmentConfigModule,
    DatabaseModule,    
    CacheModule.registerAsync(RedisOptions),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    LoggerModule,
    BcryptModule,
    CqrsModule,
    UserModule,
    TodoModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


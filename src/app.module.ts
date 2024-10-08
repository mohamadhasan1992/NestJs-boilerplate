import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { EnvironmentConfigModule } from 'shared/config';
import { DatabaseModule } from 'shared/database';
import { LoggerModule } from 'shared/logger';
import { BcryptModule } from 'shared/services';





@Module({
  imports: [
    EnvironmentConfigModule,
    DatabaseModule,    
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


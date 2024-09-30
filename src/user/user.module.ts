import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SchemaFactory } from '@nestjs/mongoose';
import { UserSchema } from './infrustructure/schema/user.schema';
import { JwtModule as JwtTokenModule } from 'src/shared/services/jwt/jwt.module';
import { AllControllers } from './presentation';
import { UserEntityRepository } from './infrustructure/repositories/user-entity.repository';
import { UserSchemaFactory } from './infrustructure/schema-factory/user-schema.factory';
import { UserEntityFactory } from './domain/entityFactories/UserEntity.factory';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { allSagas } from './application/saga';
import { BcryptService, EnvironmentConfigService, JwtTokenService } from 'src/shared';





@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: "User",
        schema: SchemaFactory.createForClass(UserSchema)
      },
    ]),
    CqrsModule,
    JwtTokenModule
  ],
  controllers: AllControllers,
  providers: [
    {provide: "UserRepository", useClass: UserEntityRepository},
    {provide: "UserSchemaFactory", useClass: UserSchemaFactory},
    {provide: "UserEntityFactory", useClass: UserEntityFactory},
    {provide: "BcryptService", useClass: BcryptService},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "JwtConfig", useClass: EnvironmentConfigService},
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...allSagas
  ],
})
export class UserModule {}


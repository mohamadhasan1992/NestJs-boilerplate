import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'shared/database/database.module';
import { UserDocumentFactory } from './infrustructure/schema/user.schema';
import { JwtModule as JwtTokenModule } from 'shared/services/jwt/jwt.module';
import { AllControllers } from './presentation';
import { UserEntityRepository } from './infrustructure/repositories/user-entity.repository';
import { UserSchemaFactory } from './infrustructure/schema-factory/user-schema.factory';
import { UserEntityFactory } from './domain/entityFactories/UserEntity.factory';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { allSagas } from './application/saga';
import { LoggerModule } from 'shared/logger';
import { BcryptService, JwtTokenService } from 'shared/services';
import { EnvironmentConfigService } from 'shared/config';
import { AuthStrategies } from 'shared/strategies';





@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: "User",
        schema: UserDocumentFactory
      },
    ]),
    CqrsModule,
    LoggerModule,
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
    ...AuthStrategies,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...allSagas
  ],
})
export class UserModule {}


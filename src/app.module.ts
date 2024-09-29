import { Module } from '@nestjs/common';
import { BcryptModule } from './infrustructure/services/bcrypt/bcrypt.module';
import { PassportModule } from '@nestjs/passport';
import { EnvironmentConfigModule } from './infrustructure/config/environment-config.module';
import { JwtModule as JwtServiceModule } from './infrustructure/services/jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './infrustructure/logger/logger.module';
import { DatabaseModule } from './infrustructure/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './infrustructure/redis/redis.module';
import { AllControllers } from './presentation';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEntityRepository } from './infrustructure/repositories/user-entity.repository';
import { JwtTokenService } from './infrustructure/services/jwt/jwt.service';
import { EnvironmentConfigService } from './infrustructure/config/environment-config.service';
import { BcryptService } from './infrustructure/services/bcrypt/bcrypt.service';
import { UserSchemaFactory } from './infrustructure/schema-factory/user-schema.factory';
import { AuthStrategies } from './presentation/strategies';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { SchemaFactory } from '@nestjs/mongoose';
import { UserSchema } from './infrustructure/schema/user.schema';
import { TodoListSchema } from './infrustructure/schema/todoList.schema';
import { TodoItemSchema } from './infrustructure/schema/todoItem.schema';
import { TodoListEntityRepository } from './infrustructure/repositories/todoList-entity.repository';
import { TodoItemEntityRepository } from './infrustructure/repositories/todoItem-entity.repository';
import { TodoListSchemaFactory } from './infrustructure/schema-factory/todoList-schema.factory';
import { TodoItemSchemaFactory } from './infrustructure/schema-factory/todoItem-schema.factory';
import { TodoItemEntityFactory } from './domain/entityFactories/TodoItemEntity.factory';
import { UserEntityFactory } from './domain/entityFactories/UserEntity.factory';
import { TodoListEntityFactory } from './domain/entityFactories/TodoListEntity.factory';





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
        name: "TodoList",
        schema: SchemaFactory.createForClass(TodoListSchema)
      },
      {
        name: "TodoItem",
        schema: SchemaFactory.createForClass(TodoItemSchema)
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
    {provide: "UserRepository", useClass: UserEntityRepository},
    {provide: "TodoListRepository", useClass: TodoListEntityRepository},
    {provide: "TodoItemRepository", useClass: TodoItemEntityRepository},
    {provide: "UserSchemaFactory", useClass: UserSchemaFactory},
    {provide: "TodoListSchemaFactory", useClass: TodoListSchemaFactory},
    {provide: "TodoItemSchemaFactory", useClass: TodoItemSchemaFactory},
    {provide: "UserEntityFactory", useClass: UserEntityFactory},
    {provide: "TodoListEntityFactory", useClass: TodoListEntityFactory},
    {provide: "TodoItemEntityFactory", useClass: TodoItemEntityFactory},
    {provide: "JwtService", useClass: JwtTokenService},
    {provide: "JwtConfig", useClass: EnvironmentConfigService},
    {provide: "BcryptService", useClass: BcryptService},
    ...AuthStrategies,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers


  ],
})
export class AppModule {}


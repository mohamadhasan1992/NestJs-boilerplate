import { Module } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { TodoListSchema } from './infrustructure/schema/todoList.schema';
import { TodoItemSchema } from './infrustructure/schema/todoItem.schema';
import { DatabaseModule } from '../shared/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AllControllers } from './presentation';
import { TodoListEntityRepository } from './infrustructure/repositories/todoList-entity.repository';
import { TodoItemEntityRepository } from './infrustructure/repositories/todoItem-entity.repository';
import { TodoListSchemaFactory } from './infrustructure/schema-factory/todoList-schema.factory';
import { TodoItemSchemaFactory } from './infrustructure/schema-factory/todoItem-schema.factory';
import { TodoListEntityFactory } from './domain/entityFactories/TodoListEntity.factory';
import { TodoItemEntityFactory } from './domain/entityFactories/TodoItemEntity.factory';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { allSagas } from './application/saga';


@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: "TodoList",
        schema: SchemaFactory.createForClass(TodoListSchema)
      },
      {
        name: "TodoItem",
        schema: SchemaFactory.createForClass(TodoItemSchema)
      }
    ]),
    CqrsModule,
  ],
  controllers: AllControllers,
  providers: [
    {provide: "TodoListRepository", useClass: TodoListEntityRepository},
    {provide: "TodoItemRepository", useClass: TodoItemEntityRepository},
    {provide: "TodoListSchemaFactory", useClass: TodoListSchemaFactory},
    {provide: "TodoItemSchemaFactory", useClass: TodoItemSchemaFactory},
    {provide: "TodoListEntityFactory", useClass: TodoListEntityFactory},
    {provide: "TodoItemEntityFactory", useClass: TodoItemEntityFactory},
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...allSagas
  ],
})
export class TodoModule {}

import { Module } from '@nestjs/common';
import { TodoListDocumentFactory } from './infrustructure/schema/todoList.schema';
import { TodoItemDocumentFactory } from './infrustructure/schema/todoItem.schema';
import { DatabaseModule } from '../shared/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AllControllers } from './presentation';
import { TodoListEntityRepository } from './infrustructure/repositories/todoList-entity.repository';
import { TodoListSchemaFactory } from './infrustructure/schema-factory/todoList-schema.factory';
import { TodoItemSchemaFactory } from './infrustructure/schema-factory/todoItem-schema.factory';
import { TodoListEntityFactory } from './domain/entityFactories/TodoListEntity.factory';
import { TodoItemEntityFactory } from './domain/entityFactories/TodoItemEntity.factory';
import { CommandHandlers } from './application/command';
import { QueryHandlers } from './application/query';
import { EventHandlers } from './application/event';
import { allSagas } from './application/saga';
import { TodoItemRepository } from './infrustructure/repositories/todoItem.repository';


@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: "TodoList",
        schema: TodoListDocumentFactory
      },
      {
        name: "TodoItem",
        schema: TodoItemDocumentFactory
      }
    ]),
    CqrsModule,
  ],
  controllers: AllControllers,
  providers: [
    {provide: "TodoListRepository", useClass: TodoListEntityRepository},
    {provide: "TodoItemRepository", useClass: TodoItemRepository},
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

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {  Inject } from '@nestjs/common';
import {  ITodoItemEntityFactory } from 'src/shared/adapters';
import { CreateTodoItemCommand } from '../../impl/todoItem/create-todoItem.command';




@CommandHandler(CreateTodoItemCommand)
export class CreateTodoItemCommandHandler implements ICommandHandler<CreateTodoItemCommand> {
  constructor(
    @Inject("TodoItemEntityFactory")
    private readonly todoItemFactory: ITodoItemEntityFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({createTodoItemDto, userId}: CreateTodoItemCommand): Promise<any> {
    const {
      title,
      description,
      priority,
      todoList
    } = createTodoItemDto;

    await this.todoItemFactory.create(
      userId, 
      title,
      todoList,
      description,
      priority
    )
    
    return {
      message: 
      "success.TODOITEM_CREATED_SUCCESSFULLY"
    }
  }
}

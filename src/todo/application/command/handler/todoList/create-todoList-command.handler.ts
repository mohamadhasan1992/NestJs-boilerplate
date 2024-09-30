import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {  Inject } from '@nestjs/common';
import {  ITodoListEntityFactory } from 'src/shared/adapters';
import { CreateTodoListCommand } from '../../impl/todoList/create-todoList.command';




@CommandHandler(CreateTodoListCommand)
export class CreateTodoListCommandHandler implements ICommandHandler<CreateTodoListCommand> {
  constructor(
    // @Inject("TodoListEntityFactory")
    // private readonly todoListFactory: EntityFactory<TodoList>,
    @Inject("TodoListEntityFactory")
    private readonly todoListFactory: ITodoListEntityFactory,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({createTodoListDto, userId}: CreateTodoListCommand): Promise<any> {
    const {
      title,
    } = createTodoListDto;

    const newTodoList = this.eventPublisher.mergeObjectContext(
      await this.todoListFactory.create(userId, title)
    );
    newTodoList.commit();
    
    return {
      message: 
      "success.TODOLIST_CREATED_SUCCESSFULLY"
    }
  }
}

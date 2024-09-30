import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {  Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  ITodoItemRepository} from 'src/shared/adapters';
import { UpdateTodoItemCommand } from '../../impl/todoItem/update-todoItem.command';




@CommandHandler(UpdateTodoItemCommand)
export class UpdateTodoItemCommandHandler implements ICommandHandler<UpdateTodoItemCommand> {
  constructor(
    @Inject("TodoItemRepository")
    private readonly todoItemRepository: ITodoItemRepository,
  ) {}

  async execute({todoItemId, updateTodoItemDto, userId}: UpdateTodoItemCommand): Promise<any> {
    const {
      title,
      description,
      priority,
      todoList
    } = updateTodoItemDto;
    const todoItem = await this.todoItemRepository.findOne({_id: todoItemId});
    if(!todoItem){
      throw new NotFoundException("error.TodoItem_NOT_FOUND")
    }
    if(todoItem.getUser() != userId){
      throw new UnauthorizedException("error.TODOItem_NOT_YOURS")
    }
    todoItem.updateDetail(
      title,
      description,
      priority,
      todoList
    );
    await this.todoItemRepository.findOneAndReplace({_id: todoItemId}, todoItem)

    return {
      message: 
      "success.TODOItem_UPDATED_SUCCESSFULLY"
    }
  }
}

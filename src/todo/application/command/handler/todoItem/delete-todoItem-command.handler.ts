import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {  Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  ITodoItemRepository } from 'src/shared/adapters';
import { DeleteTodoItemCommand } from '../../impl/todoItem/delete-todoItem-command';




@CommandHandler(DeleteTodoItemCommand)
export class DeleteTodoItemCommandHandler implements ICommandHandler<DeleteTodoItemCommand> {
  constructor(
    @Inject("TodoItemRepository")
    private readonly todoItemRepository: ITodoItemRepository,
  ) {}

  async execute({todoItemId, userId}: DeleteTodoItemCommand): Promise<any> {
    const todoItem = await this.todoItemRepository.findOne({_id: todoItemId});
    if(!todoItem){
      throw new NotFoundException("error.TodoITEM_NOT_FOUND")
    }
    if(todoItem.getUser() != userId){
      throw new UnauthorizedException("error.TODOITEM_NOT_YOURS")
    }

    await this.todoItemRepository.delete({_id: todoItemId}, todoItem)
    
    return {
      message: 
      "success.TODOITEM_DELETED_SUCCESSFULLY"
    }
  }
}

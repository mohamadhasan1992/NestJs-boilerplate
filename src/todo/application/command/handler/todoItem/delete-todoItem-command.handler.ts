import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {  Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  ITodoItemRepository } from 'src/shared/adapters';
import { DeleteTodoItemCommand } from '../../impl/todoItem/delete-todoItem-command';




@CommandHandler(DeleteTodoItemCommand)
export class DeleteTodoItemCommandHandler implements ICommandHandler<DeleteTodoItemCommand> {
  constructor(
    @Inject("TodoItemRepository")
    private readonly todoItemRepository: ITodoItemRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({todoItemId, userId}: DeleteTodoItemCommand): Promise<any> {
    const todoItem = await this.todoItemRepository.findOneById(todoItemId);
    if(!todoItem){
      throw new NotFoundException("error.TodoITEM_NOT_FOUND")
    }
    if(todoItem.getUser() != userId){
      throw new UnauthorizedException("error.TODOITEM_NOT_YOURS")
    }

    const deletedTodoItem = this.eventPublisher.mergeObjectContext(
      todoItem
    );
    await this.todoItemRepository.delete({_id: todoItemId}, todoItem)
    deletedTodoItem.DeleteComplete()
    deletedTodoItem.commit();
    
    return {
      message: 
      "success.TODOITEM_DELETED_SUCCESSFULLY"
    }
  }
}

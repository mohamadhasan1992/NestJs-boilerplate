import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {  Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  ITodoListRepository } from 'src/shared/adapters';
import { DeleteTodoListCommand } from '../../impl/todoList/delete-todoList-command';




@CommandHandler(DeleteTodoListCommand)
export class DeleteTodoListCommandHandler implements ICommandHandler<DeleteTodoListCommand> {
  constructor(
    @Inject("TodoListRepository")
    private readonly todoListRepository: ITodoListRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({todoListId, userId}: DeleteTodoListCommand): Promise<any> {
    const todoList = await this.todoListRepository.findOneById(todoListId);
    if(!todoList){
      throw new NotFoundException("error.TodoList_NOT_FOUND")
    }
    if(todoList.getUser() != userId){
      throw new UnauthorizedException("error.TODOLIST_NOT_YOURS")
    }

    const deletedTodoList = this.eventPublisher.mergeObjectContext(
      todoList
    );
    await this.todoListRepository.delete({_id: todoListId}, todoList)
    deletedTodoList.DeleteComplete()
    deletedTodoList.commit();
    
    return {
      message: 
      "success.TODOLIST_DELETED_SUCCESSFULLY"
    }
  }
}

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {  Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  ITodoListRepository } from 'shared/adapters';
import { UpdateTodoListCommand } from '../../impl/todoList/update-todoList.command';




@CommandHandler(UpdateTodoListCommand)
export class UpdateTodoListCommandHandler implements ICommandHandler<UpdateTodoListCommand> {
  constructor(
    @Inject("TodoListRepository")
    private readonly todoListRepository: ITodoListRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({todoListId, updateTodoListDto, userId}: UpdateTodoListCommand): Promise<any> {
    const {
      title
    } = updateTodoListDto;
    const todoList = await this.todoListRepository.findOneById(todoListId);
    if(!todoList){
      throw new NotFoundException("error.TodoList_NOT_FOUND")
    }
    if(todoList.getUser() != userId){
      throw new UnauthorizedException("error.TODOLIST_NOT_YOURS")
    }
    todoList.updateTitle(title);
    const newTodoList = this.eventPublisher.mergeObjectContext(
      todoList
    );
    await this.todoListRepository.findOneAndReplaceById(todoListId, todoList)
    newTodoList.commit();
    
    return {
      message: 
      "success.TODOLIST_UPDATED_SUCCESSFULLY"
    }
  }
}

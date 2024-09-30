import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {  Inject } from '@nestjs/common';
import {  ITodoItemRepository } from 'shared/adapters';
import { DeleteTodoListAllTodoItemsCommand } from '../../impl/todoItem/delete-todoList-all-todoItem.command';




@CommandHandler(DeleteTodoListAllTodoItemsCommand)
export class DeleteTodoListAllTodoItemsCommandHandler implements ICommandHandler<DeleteTodoListAllTodoItemsCommand> {
  constructor(
    @Inject("TodoItemRepository")
    private readonly todoItemRepository: ITodoItemRepository,
  ) {}

  async execute({todoListId}: DeleteTodoListAllTodoItemsCommand): Promise<any> {
    await this.todoItemRepository.deleteMany({todoList: todoListId})
  }
}

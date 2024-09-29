import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ITodoListRepository } from 'src/shared/adapters';
import { GetTodoListDetailQuery } from '../../impl/todoList/get-todoList-detail-query';




@QueryHandler(GetTodoListDetailQuery)
export class getTodoListDetalHandler implements IQueryHandler<GetTodoListDetailQuery> {
  constructor(
    @Inject("TodoListRepository")
    private readonly todoListRepository: ITodoListRepository
  ) {}

  async execute({todoListId}: GetTodoListDetailQuery) {
    return this.todoListRepository.findOneById(todoListId)
  }
}

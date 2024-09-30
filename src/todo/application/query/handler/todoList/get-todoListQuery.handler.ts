import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTodoListQuery } from '../../impl/todoItem/get-todoItem-query';
import { ITodoListRepository } from 'shared/adapters';




@QueryHandler(GetTodoListQuery)
export class getTodoListQueryHandler implements IQueryHandler<GetTodoListQuery> {
  constructor(
    @Inject("TodoListRepository")
    private readonly todoListRepository: ITodoListRepository
  ) {}

  async execute({filterQuery}: GetTodoListQuery) {
    return this.todoListRepository.findAll(filterQuery)
  }
}

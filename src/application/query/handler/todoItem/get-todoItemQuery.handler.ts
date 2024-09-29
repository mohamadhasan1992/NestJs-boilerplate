import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ITodoItemRepository} from 'src/shared/adapters';
import { GetTodoItemQuery } from '../../impl/todoList/get-todoList-query';




@QueryHandler(GetTodoItemQuery)
export class getTodoItemQueryHandler implements IQueryHandler<GetTodoItemQuery> {
  constructor(
    @Inject("TodoItemRepository")
    private readonly todoItemRepository: ITodoItemRepository
  ) {}

  async execute({filterQuery}: GetTodoItemQuery) {
    return this.todoItemRepository.findAll(filterQuery)
  }
}

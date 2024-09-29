import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ITodoItemRepository} from 'src/shared/adapters';
import { GetTodoItemDetailQuery } from '../../impl/todoItem/get-todoItem-detail-query';




@QueryHandler(GetTodoItemDetailQuery)
export class getTodoItemDetailHandler implements IQueryHandler<GetTodoItemDetailQuery> {
  constructor(
    @Inject("TodoItemRepository")
    private readonly todoItemRepository: ITodoItemRepository
  ) {}

  async execute({todoItemId}: GetTodoItemDetailQuery) {
    return this.todoItemRepository.findOneById(todoItemId)
  }
}

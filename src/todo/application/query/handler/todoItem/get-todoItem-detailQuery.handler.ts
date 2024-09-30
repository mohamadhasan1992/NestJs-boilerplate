import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ITodoItemRepository} from 'src/shared/adapters';
import { GetTodoItemDetailQuery } from '../../impl/todoItem/get-todoItem-detail-query';




@QueryHandler(GetTodoItemDetailQuery)
export class getTodoItemDetailHandler implements IQueryHandler<GetTodoItemDetailQuery> {
  constructor(
    @Inject("TodoItemRepository")
    private readonly todoItemRepository: ITodoItemRepository
  ) {}

  async execute({todoItemId}: GetTodoItemDetailQuery) {
    const todoItem = await this.todoItemRepository.findOne({_id: todoItemId})
    if(!!todoItem){
      return todoItem
    }else{
      throw new NotFoundException("error.TODOITEM_NOT_FOUND")
    }

  }
}

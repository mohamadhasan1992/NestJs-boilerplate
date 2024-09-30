import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ITodoListRepository } from 'src/shared/adapters';
import { GetTodoListDetailQuery } from '../../impl/todoList/get-todoList-detail-query';




@QueryHandler(GetTodoListDetailQuery)
export class getTodoListDetalHandler implements IQueryHandler<GetTodoListDetailQuery> {
  constructor(
    @Inject("TodoListRepository")
    private readonly todoListRepository: ITodoListRepository
  ) {}

  async execute({todoListId}: GetTodoListDetailQuery) {
    const todoList = await this.todoListRepository.findOneById(
      todoListId, 
      [
        {
          path: "TodoItems",
          model: "TodoItem",
          select: [
            "title",
            "description"
          ],
          options: {
            skip: 0,
            limit: 10,
          },
        }
      ]
    )

    if(!!todoList){
      return todoList
    }else{
      throw new NotFoundException("error.TODOLIST_NOT_FOUND")
    }
  }
}

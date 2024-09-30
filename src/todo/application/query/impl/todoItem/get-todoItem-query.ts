import { FilterQuery } from "mongoose";
import { TodoListSchema } from "src/todo/infrustructure/schema/todoList.schema";


export class GetTodoListQuery {
    constructor(
        public readonly filterQuery: FilterQuery<TodoListSchema>
      ) {}
}
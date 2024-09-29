import { FilterQuery } from "mongoose";
import { TodoListSchema } from "src/infrustructure/schema/todoList.schema";

export class GetTodoListQuery {
    constructor(
        public readonly filterQuery: FilterQuery<TodoListSchema>
      ) {}
}
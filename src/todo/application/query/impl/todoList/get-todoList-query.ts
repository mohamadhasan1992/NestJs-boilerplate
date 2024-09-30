import { FilterQuery } from "mongoose";
import { TodoItemSchema } from "src/todo/infrustructure/schema/todoItem.schema";


export class GetTodoItemQuery {
    constructor(
        public readonly filterQuery: FilterQuery<TodoItemSchema>
      ) {}
}
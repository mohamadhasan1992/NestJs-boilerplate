import { CreateTodoItemDto } from "src/todo/application/dto/todoItem/create-todoItem.dto";



export class CreateTodoItemCommand {
    constructor(
        public readonly createTodoItemDto: CreateTodoItemDto,
        public readonly userId: string,
    ) {}
}
  

import { CreateTodoItemDto } from "src/application/dto/todoItem/create-todoItem.dto";



export class CreateTodoItemCommand {
    constructor(
        public readonly createTodoItemDto: CreateTodoItemDto,
        public readonly userId: string,
    ) {}
}
  

import { CreateTodoListDto } from "src/todo/application/dto/todoList/create-todoList.dto";



export class CreateTodoListCommand {
    constructor(
        public readonly createTodoListDto: CreateTodoListDto,
        public readonly userId: string,
    ) {}
}
  

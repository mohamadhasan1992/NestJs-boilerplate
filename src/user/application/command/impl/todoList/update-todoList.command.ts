import { UpdateTodoListDto } from "src/todo/application/dto/todoList/update-todoList.dto";



export class UpdateTodoListCommand {
    constructor(
      public readonly todoListId: string,
      public readonly updateTodoListDto: UpdateTodoListDto,
      public readonly userId: string
    ) {}
}
  

import { UpdateTodoItemDto } from "src/application/dto/todoItem/update-todoItem.dto";



export class UpdateTodoItemCommand {
    constructor(
      public readonly todoItemId: string,
      public readonly updateTodoItemDto: UpdateTodoItemDto,
      public readonly userId: string
    ) {}
}
  

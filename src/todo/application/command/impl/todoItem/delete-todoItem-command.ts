


export class DeleteTodoItemCommand {
    constructor(
        public readonly todoItemId: string,
        public readonly userId: string,
    ) {}
}
  

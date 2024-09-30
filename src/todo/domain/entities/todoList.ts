import { AggregateRoot } from "@nestjs/cqrs";
import { TodoListDeletedEvent } from "../events/impl/todoList/todoList-deleted.event";
import { TodoItem } from "./todoItem";



export class TodoList extends AggregateRoot{
    private todoItems: TodoItem[];
    constructor(
      private readonly _id: string,
      private readonly user: string,
      private title: string,
      todoItems?: TodoItem[]
    ) {
      super()
      this.todoItems = todoItems;
    }

    getTodoItems(): TodoItem[] {
      return this.todoItems;
    }

    getId(){
      return this._id
    }

    getUser(): string{
      return this.user;
    }

    getTitle(): string{
      return this.title;
    }

    updateTitle(title: string){
      this.title = title;
    }

    newTodoListCreated(){
      // this.apply(new UserSignedUpEvent(this._id, this.phone_number));
    }
    DeleteComplete(){
      this.apply(new TodoListDeletedEvent(this._id));
    }
}
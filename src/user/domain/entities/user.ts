import { AggregateRoot } from "@nestjs/cqrs";
import { TodoList } from "src/todo/domain/entities/todoList";



export class User extends AggregateRoot{
    private todoLists: TodoList[];
    constructor(
      private readonly _id: string,
      private email: string,
      private password: string,
      private refreshToken: string,
      todoLists?: TodoList[]
    ) {
      super()
      this.todoLists = todoLists;
    }

    getTodoLists(): string[] | TodoList[] {
      return this.todoLists;
    }

    getId(){
      return this._id
    }

    getEmail(): string{
      return this.email;
    }
    
    getRefreshToken(): string{
      return this.refreshToken;
    }

    getPassword(): string{
      return this.password;
    }
    setRefreshToken(token: string): void{
      this.refreshToken = token;
    }

    setPassword(password: string): void{
      this.password = password;
    }

}
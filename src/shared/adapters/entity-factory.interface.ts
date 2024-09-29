import { TodoItem } from "src/domain/entities/todoItem";
import { TodoList } from "src/domain/entities/todoList";
import { User } from "src/domain/entities/user";
import { PriorityEnum } from "src/domain/object-values/Priority.enum";


export interface IUserEntityFactory {
    create(email:string , password: string): User | Promise<User>;
}
  
export interface ITodoListEntityFactory {
    create(user: string, title:string): TodoList | Promise<TodoList>;
}

export interface ITodoItemEntityFactory {
    create(
        user: string,
        title: string,
        todoList: string,
        description: string,
        priority: PriorityEnum
    ): TodoItem | Promise<TodoItem>;
}
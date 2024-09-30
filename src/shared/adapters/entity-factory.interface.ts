import { TodoItem } from "src/todo/domain/entities/todoItem";
import { TodoList } from "src/todo/domain/entities/todoList";
import { PriorityEnum } from "src/todo/domain/object-values/Priority.enum";
import { User } from "src/user/domain/entities/user";



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
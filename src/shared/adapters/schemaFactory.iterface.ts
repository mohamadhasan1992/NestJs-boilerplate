import { UserSchema } from "src/infrustructure/schema/user.schema";
import { TodoListSchema } from "src/infrustructure/schema/todoList.schema";
import { TodoItemSchema } from "src/infrustructure/schema/todoItem.schema";
import { User } from "src/domain/entities/user";
import { TodoList } from "src/domain/entities/todoList";
import { TodoItem } from "src/domain/entities/todoItem";

export interface IUserSchemaFactory{
    create(user: User): UserSchema,
    createFromSchema(user: UserSchema): User
}

export interface ITodoListSchemaFactory{
    create(user: TodoList): TodoListSchema,
    createFromSchema(todoList: TodoListSchema): TodoList
}

export interface ITodoItemSchemaFactory{
    create(todoItem: TodoItem): TodoItemSchema,
    createFromSchema(todoItem: TodoItemSchema): TodoItem
}
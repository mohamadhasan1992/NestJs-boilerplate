import { TodoItem } from "src/todo/domain/entities/todoItem"
import { TodoList } from "src/todo/domain/entities/todoList"
import { TodoItemSchema } from "src/todo/infrustructure/schema/todoItem.schema"
import { TodoListSchema } from "src/todo/infrustructure/schema/todoList.schema"
import { User } from "src/user/domain/entities/user"
import { UserSchema } from "src/user/infrustructure/schema/user.schema"


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
import { FilterQuery } from "mongoose";
import { TodoItem } from "src/domain/entities/todoItem";
import { TodoList } from "src/domain/entities/todoList";
import { User } from "src/domain/entities/user";
import { TodoItemSchema } from "src/infrustructure/schema/todoItem.schema";
import { TodoListSchema } from "src/infrustructure/schema/todoList.schema";
import { IPaginationData } from "./pagination.interfac";



export interface IUserRepository {
    create(user: User): Promise<User>;
    findOneAndReplaceById(id: string, user: User): Promise<User>;
    delete(filterQuery: FilterQuery<User>): Promise<void>;
    findByEmail(email: string): Promise<User|null>;
    findOneById(id: string): Promise<User | null>;
    findOne(filterQuery: FilterQuery<User>): Promise<User|null>,
    findAll(): Promise<IPaginationData<User>>;
    updateRefreshToken(userId: string, currentHashedRefreshToken: string): Promise<User|null>;
}

export interface ITodoListRepository {
    create(todoList: TodoList): Promise<TodoList>;
    findOneAndReplaceById(id: string, todoList: TodoList): Promise<TodoList>;
    delete(filterQuery: FilterQuery<TodoList>): Promise<TodoList>;
    findOneById(id: string): Promise<TodoList | null>;
    findAll(filterQuery: FilterQuery<TodoListSchema>): Promise<IPaginationData<TodoList>>;
}

export interface ITodoItemRepository {
    create(todoItem: TodoItem): Promise<TodoItem>;
    findOneAndReplaceById(id: string, todoItem: TodoItem): Promise<TodoItem>;
    delete(filterQuery: FilterQuery<TodoItem>): Promise<TodoItem>;
    findOneById(id: string): Promise<TodoItem | null>;
    findAll(filterQuery: FilterQuery<TodoItemSchema>): Promise<IPaginationData<TodoItem>>

}
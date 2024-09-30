import { FilterQuery } from "mongoose";
import { IPaginationData } from "./pagination.interfac";
import { User } from "src/user/domain/entities/user";
import { TodoList } from "src/todo/domain/entities/todoList";
import { TodoListSchema } from "src/todo/infrustructure/schema/todoList.schema";
import { TodoItem } from "src/todo/domain/entities/todoItem";
import { TodoItemSchema } from "src/todo/infrustructure/schema/todoItem.schema";



export interface IUserRepository {
    create(user: User): Promise<User>;
    findOneAndReplaceById(id: string, user: User): Promise<User>;
    delete(filterQuery: FilterQuery<User>, user: User): Promise<void>;
    findByEmail(email: string): Promise<User|null>;
    findOneById(id: string): Promise<User | null>;
    findOne(filterQuery: FilterQuery<User>): Promise<User|null>,
    findAll(): Promise<IPaginationData<User>>;
    updateRefreshToken(userId: string, currentHashedRefreshToken: string): Promise<User|null>;
}

export interface ITodoListRepository {
    create(todoList: TodoList): Promise<TodoList>;
    findOneAndReplaceById(id: string, todoList: TodoList): Promise<TodoList>;
    delete(filterQuery: FilterQuery<TodoList>, todoList: TodoList): Promise<TodoList>;
    findOneById(id: string): Promise<TodoList | null>;
    findAll(filterQuery: FilterQuery<TodoListSchema>): Promise<IPaginationData<TodoList>>;
}

export interface ITodoItemRepository {
    create(todoItem: TodoItem): Promise<TodoItem>;
    findOneAndReplaceById(id: string, todoItem: TodoItem): Promise<TodoItem>;
    delete(filterQuery: FilterQuery<TodoItem>, todoItem: TodoItem): Promise<TodoItem>;
    findOneById(id: string): Promise<TodoItem | null>;
    findAll(filterQuery: FilterQuery<TodoItemSchema>): Promise<IPaginationData<TodoItem>>,
    deleteMany(filterQuery: FilterQuery<TodoItemSchema>): Promise<void>

}
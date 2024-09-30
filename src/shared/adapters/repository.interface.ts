import { FilterQuery, PopulateOptions } from "mongoose";
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
    findOneById(id: string, popOptions?: PopulateOptions[], select?: string[]): Promise<User | null>;
    findOne(filterQuery: FilterQuery<User>, popOptions?: PopulateOptions[], select?: string[]): Promise<User|null>,
    updateRefreshToken(userId: string, currentHashedRefreshToken: string): Promise<User|null>;
}

export interface ITodoListRepository {
    create(todoList: TodoList): Promise<TodoList>;
    findOneAndReplaceById(id: string, todoList: TodoList): Promise<TodoList>;
    delete(filterQuery: FilterQuery<TodoList>, todoList: TodoList): Promise<TodoList>;
    findOneById(id: string, popOptions?: PopulateOptions[], select?: string[]): Promise<TodoList | null>;
    findAll(filterQuery: FilterQuery<TodoListSchema>): Promise<IPaginationData<TodoList>>;
}

export interface ITodoItemRepository {
    create(todoItem: TodoItem): Promise<TodoItem>;
    findOne(filterQuery: FilterQuery<TodoItem>): Promise<TodoItem>;
    findAll(filterQuery: FilterQuery<TodoItemSchema>): Promise<IPaginationData<TodoItem>>,
    delete(filterQuery: FilterQuery<TodoItem>, todoItem: TodoItem): Promise<TodoItem>;
    findOneAndReplace(filterQuery: FilterQuery<TodoItem>, todoItem: TodoItem): Promise<void>;
    deleteMany(filterQuery: FilterQuery<TodoItemSchema>): Promise<void>

}
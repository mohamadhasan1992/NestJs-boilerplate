import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { TodoList } from "../entities/todoList";
import { ITodoListRepository } from "src/shared/adapters";
import { EntityFactory } from "src/shared";



@Injectable()
export class TodoListEntityFactory implements EntityFactory<TodoList>{
    constructor(
        @Inject("TodoListRepository") 
        private readonly todoListRepository: ITodoListRepository,
    ){}

    async create(user: string, title: string): Promise<TodoList> {
        const todoList = new TodoList(
            new Types.ObjectId().toHexString(), 
            user,
            title
        )
        await this.todoListRepository.create(todoList)
        return todoList
    }
}
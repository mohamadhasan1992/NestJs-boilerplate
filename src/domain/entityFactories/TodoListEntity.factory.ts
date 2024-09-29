import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { EntityFactory } from "src/infrustructure/database/entity.factory";
import { TodoList } from "../entities/todoList";
import { ITodoListRepository } from "src/shared/adapters";



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
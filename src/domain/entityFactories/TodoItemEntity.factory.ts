import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { EntityFactory } from "src/infrustructure/database/entity.factory";
import { PriorityEnum } from "../object-values/Priority.enum";
import { ITodoItemRepository } from "src/shared/adapters";
import { TodoItem } from "../entities/todoItem";



@Injectable()
export class TodoItemEntityFactory implements EntityFactory<TodoItem>{
    constructor(
        @Inject("TodoItemRepository") 
        private readonly todoItemRepository: ITodoItemRepository,
    ){}

    async create(
        user: string, 
        title: string, 
        todoList: string,
        description: string, 
        priority: PriorityEnum
    ): Promise<TodoItem> {
        const todoItem = new TodoItem(
            new Types.ObjectId().toHexString(), 
            user,
            todoList,
            title,
            description,
            priority
        )
        await this.todoItemRepository.create(todoItem)
        return todoItem
    }
}
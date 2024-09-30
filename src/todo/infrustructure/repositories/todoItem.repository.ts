import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TodoItemSchema } from "../schema/todoItem.schema";
import { TodoItem } from "src/todo/domain/entities/todoItem";
import { BaseRepository } from "shared/database";
import { ITodoItemSchemaFactory } from "shared/adapters";



@Injectable()
export class TodoItemRepository extends BaseRepository<TodoItemSchema, TodoItem>{
    constructor(
        @InjectModel("TodoItem")
        todoItemModel: Model<TodoItemSchema>,
        @Inject("TodoItemSchemaFactory")
        todoItemSchemaFactory: ITodoItemSchemaFactory,

    ){
        super(todoItemModel, todoItemSchemaFactory);
    }
}
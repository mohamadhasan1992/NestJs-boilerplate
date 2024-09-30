import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TodoItemSchema } from "../schema/todoItem.schema";
import { ITodoItemSchemaFactory } from "src/shared/adapters";
import { BaseEntityRepository } from "src/shared";
import { TodoItem } from "src/todo/domain/entities/todoItem";



@Injectable()
export class TodoItemEntityRepository extends BaseEntityRepository<TodoItemSchema, TodoItem>{
    constructor(
        @InjectModel("TodoItem")
        todoItemModel: Model<TodoItemSchema>,
        @Inject("TodoItemSchemaFactory")
        todoItemSchemaFactory: ITodoItemSchemaFactory,

    ){
        super(todoItemModel, todoItemSchemaFactory);
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "src/infrustructure/database/base-entity.repository";
import { TodoItemSchema } from "../schema/todoItem.schema";
import { TodoItem } from "src/domain/entities/todoItem";
import { ITodoItemSchemaFactory } from "src/shared/adapters";



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
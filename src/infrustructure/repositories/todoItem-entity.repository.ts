import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "src/infrustructure/database/base-entity.repository";
import { TodoItemSchema } from "../schema/todoItem.schema";
import { TodoItem } from "src/domain/entities/todoItem";
import { TodoItemSchemaFactory } from "../schema-factory/todoItem-schema.factory";



@Injectable()
export class TodoItemEntityRepository extends BaseEntityRepository<TodoItemSchema, TodoItem>{
    constructor(
        @InjectModel("TodoItem")
        todoItemModel: Model<TodoItemSchema>,
        todoItemSchemaFactory: TodoItemSchemaFactory
    ){
        super(todoItemModel, todoItemSchemaFactory);
    }
}
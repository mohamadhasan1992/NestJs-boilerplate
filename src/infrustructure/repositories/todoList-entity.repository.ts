import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "src/infrustructure/database/base-entity.repository";
import { TodoListSchema } from "../schema/todoList.schema";
import { TodoList } from "src/domain/entities/todoList";
import { TodoListSchemaFactory } from "../schema-factory/todoList-schema.factory";



@Injectable()
export class TodoListEntityRepository extends BaseEntityRepository<TodoListSchema, TodoList>{
    constructor(
        @InjectModel("TodoList")
        todoListModel: Model<TodoListSchema>,
        todoListSchemaFactory: TodoListSchemaFactory
    ){
        super(todoListModel, todoListSchemaFactory);
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "src/infrustructure/database/base-entity.repository";
import { TodoListSchema } from "../schema/todoList.schema";
import { TodoList } from "src/domain/entities/todoList";
import { ITodoListSchemaFactory } from "src/shared/adapters";



@Injectable()
export class TodoListEntityRepository extends BaseEntityRepository<TodoListSchema, TodoList>{
    constructor(
        @InjectModel("TodoList")
        todoListModel: Model<TodoListSchema>,
        @Inject("TodoListSchemaFactory")
        todoListSchemaFactory: ITodoListSchemaFactory,
    ){
        super(todoListModel, todoListSchemaFactory);
    }
}
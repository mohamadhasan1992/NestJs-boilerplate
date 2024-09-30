import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TodoListSchema } from "../schema/todoList.schema";
import { ITodoListSchemaFactory } from "shared/adapters";
import { TodoList } from "src/todo/domain/entities/todoList";
import { BaseEntityRepository } from "shared/database";



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
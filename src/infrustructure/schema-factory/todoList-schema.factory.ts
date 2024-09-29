import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { EntitySchemaFactory } from "src/infrustructure/database/entity-schema.factory";
import { TodoListSchema } from "../schema/todoList.schema";
import { TodoList } from "src/domain/entities/todoList";





@Injectable()
export class TodoListSchemaFactory implements EntitySchemaFactory<TodoListSchema, TodoList>{
    create(todoList: TodoList): TodoListSchema {
        return{
            _id: new Types.ObjectId(todoList.getId()),
            title: todoList.getTitle(),
            user: todoList.getUser()
        }
    }
    createFromSchema(todoList: TodoListSchema): TodoList {
        return new TodoList(
            todoList._id.toHexString(),
            todoList.user,
            todoList.title,
        )
    }
    
}
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { TodoListSchema } from "../schema/todoList.schema";
import { TodoList } from "src/todo/domain/entities/todoList";
import { EntitySchemaFactory } from "src/shared";





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
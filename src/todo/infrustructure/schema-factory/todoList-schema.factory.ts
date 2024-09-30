import { Injectable } from "@nestjs/common";
import mongoose, { Types } from "mongoose";
import { TodoListSchema } from "../schema/todoList.schema";
import { TodoList } from "src/todo/domain/entities/todoList";
import { TodoItem } from "src/todo/domain/entities/todoItem";
import { EntitySchemaFactory } from "shared/database";


export interface TodoListSchemaWithTodoItems extends Document {
    _id: mongoose.Types.ObjectId;
    user: string;
    title: string;
    TodoItems?: TodoItem[]; 
  }


@Injectable()
export class TodoListSchemaFactory implements EntitySchemaFactory<TodoListSchema, TodoList>{
    create(todoList: TodoList): TodoListSchema {
        return{
            _id: new Types.ObjectId(todoList.getId()),
            title: todoList.getTitle(),
            user: todoList.getUser()
        }
    }
    createFromSchema(todoList: TodoListSchemaWithTodoItems): TodoList {
        return new TodoList(
            todoList._id.toHexString(),
            todoList.user,
            todoList.title,
            todoList.TodoItems
        )
    }
    
}
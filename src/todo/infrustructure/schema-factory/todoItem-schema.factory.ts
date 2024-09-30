import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { TodoItemSchema } from "../schema/todoItem.schema";
import { BaseSchemaFactory} from "src/shared";
import { TodoItem } from "src/todo/domain/entities/todoItem";





@Injectable()
export class TodoItemSchemaFactory implements BaseSchemaFactory<TodoItemSchema, TodoItem>{
    create(todoItem: TodoItem): TodoItemSchema {
        return{
            _id: new Types.ObjectId(todoItem.getId()),
            title: todoItem.getTitle(),
            user: todoItem.getUser(),
            description: todoItem.getDescription(),
            priority: todoItem.getPriority(),
            todoList: todoItem.getTodoList()
        }
    }    
    createFromSchema(todoItem: TodoItemSchema): TodoItem {
        return new TodoItem(
            todoItem._id.toHexString(),
            todoItem.user,
            todoItem.todoList,
            todoItem.title,
            todoItem.description,
            todoItem.priority
        )
    }
}
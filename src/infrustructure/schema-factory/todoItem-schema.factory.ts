import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { EntitySchemaFactory } from "src/infrustructure/database/entity-schema.factory";
import { TodoItemSchema } from "../schema/todoItem.schema";
import { TodoItem } from "src/domain/entities/todoItem";





@Injectable()
export class TodoItemSchemaFactory implements EntitySchemaFactory<TodoItemSchema, TodoItem>{
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
            todoItem.priority,
        )
    }
    
}
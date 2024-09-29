import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../database/identifiable-entity.schema';
import mongoose from 'mongoose';
import { PriorityEnum } from 'src/domain/object-values/Priority.enum';



@Schema({versionKey: false, collection: "TodoItem", timestamps: true})
export class TodoItemSchema extends IdentifiableEntitySchema {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User"})
    user: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "TodoList"})
    todoList: string;

    @Prop({type: String})
    title:  string;

    @Prop({type: String})
    description: string;

    @Prop({type: String, enum: PriorityEnum, default: PriorityEnum.Mid})
    priority: PriorityEnum;
}


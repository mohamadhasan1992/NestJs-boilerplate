import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../../../shared/database/identifiable-entity.schema';
import mongoose from 'mongoose';



@Schema({versionKey: false, collection: "TodoList", timestamps: true})
export class TodoListSchema extends IdentifiableEntitySchema {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User"})
    user: string;

    @Prop({type: String})
    title:  string;

}


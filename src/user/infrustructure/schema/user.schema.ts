import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from 'src/shared';


@Schema({versionKey: false, collection: "User"})
export class UserSchema extends IdentifiableEntitySchema {

    @Prop({type: String, unique: true})
    email: string;

    @Prop({type: String})
    password: string;

    @Prop()
    refreshToken?: string;
}

export const UserDocumentFactory = SchemaFactory.createForClass(UserSchema)


UserDocumentFactory.virtual('TodoLists', {
    ref: () => "TodoList",
    localField: '_id',
    foreignField: 'user'
});
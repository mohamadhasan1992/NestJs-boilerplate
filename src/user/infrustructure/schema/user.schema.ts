import { Prop, Schema } from '@nestjs/mongoose';
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



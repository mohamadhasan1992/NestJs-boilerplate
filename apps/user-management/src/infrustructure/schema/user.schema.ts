import { Prop, Schema } from '@nestjs/mongoose';
import { UserStatusEnum } from '../../domain/object-values/user-status.enum';
import { IdentifiableEntitySchema } from '@shared/shared';


@Schema({versionKey: false, collection: "User"})
export class UserSchema extends IdentifiableEntitySchema {
  @Prop({type: String})
    fullName: string;

    @Prop({type: String, unique: true})
    email: string;

    @Prop({type: String, enum: UserStatusEnum, default: UserStatusEnum.WaitingForActivation})
    status: UserStatusEnum;

    @Prop({type: String})
    password: string;

    @Prop()
    refreshToken?: string;
}



import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../database/identifiable-entity.schema';
import { RoleEnum } from 'src/domain/object-values/Role.enum';
import { UserStatusEnum } from 'src/domain/object-values/user-status.enum';


@Schema({versionKey: false, collection: "User"})
export class UserSchema extends IdentifiableEntitySchema {
  @Prop({type: String})
    fullName: string;

    @Prop({type: String, unique: true})
    email: string;

    @Prop({type: String, enum: UserStatusEnum, default: UserStatusEnum.WaitingForActivation})
    status: UserStatusEnum;

    @Prop({type: String, unique: true})
    phone_number: string;

    @Prop({type: String})
    password: string;

    @Prop({type: String, enum: RoleEnum, default: RoleEnum.Customer})
    role: RoleEnum;

    @Prop()
    refreshToken?: string;
}



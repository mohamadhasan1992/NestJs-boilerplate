import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { UserSchema } from "../schema/user.schema";
import { User } from "../../domain/entities/user";
import { EntitySchemaFactory } from "@shared/shared";





@Injectable()
export class UserSchemaFactory implements EntitySchemaFactory<UserSchema, User>{
    create(user: User): UserSchema {
        return{
            _id: new Types.ObjectId(user.getId()),
            fullName: user.getFullName(),
            email: user.getEmail(),
            password: user.getPassword(),
        }
    }
    createFromSchema(user: UserSchema): User {
        return new User(
            user._id.toHexString(),
            user.fullName,
            user.email,
            user.password,
        )
    }
    
}
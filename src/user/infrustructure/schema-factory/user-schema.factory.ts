import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { UserSchema } from "../schema/user.schema";
import { EntitySchemaFactory } from "src/shared";
import { User } from "src/user/domain/entities/user";





@Injectable()
export class UserSchemaFactory implements EntitySchemaFactory<UserSchema, User>{
    create(user: User): UserSchema {
        return{
            _id: new Types.ObjectId(user.getId()),
            email: user.getEmail(),
            password: user.getPassword(),
            refreshToken: user.getRefreshToken()
        }
    }
    createFromSchema(user: UserSchema): User {
        return new User(
            user._id.toHexString(),
            user.email,
            user.password,
            user.refreshToken
        )
    }
    
}
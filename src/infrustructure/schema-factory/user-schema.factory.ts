import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { UserSchema } from "../schema/user.schema";
import { EntitySchemaFactory } from "src/infrustructure/database/entity-schema.factory";
import { User } from "src/domain/entities/user";





@Injectable()
export class UserSchemaFactory implements EntitySchemaFactory<UserSchema, User>{
    create(user: User): UserSchema {
        return{
            _id: new Types.ObjectId(user.getId()),
            fullName: user.getFullName(),
            email: user.getEmail(),
            password: user.getPassword(),
            phone_number: user.getPhoneNumber(),
            role: user.getRole(),
            refreshToken: user.getRefreshToken(),
            status: user.getStatus()
        }
    }
    createFromSchema(user: UserSchema): User {
        return new User(
            user._id.toHexString(),
            user.fullName,
            user.email,
            user.password,
            user.phone_number,
            user.role,
            user.refreshToken,
            user.status
        )
    }
    
}
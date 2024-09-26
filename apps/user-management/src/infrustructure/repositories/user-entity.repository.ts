import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserSchema } from "../schema/user.schema";
import { UserSchemaFactory } from "../schema-factory/user-schema.factory";
import { BaseEntityRepository } from "@shared/shared";
import { User } from "../../domain/entities/user";



@Injectable()
export class UserEntityRepository extends BaseEntityRepository<UserSchema, User>{
    constructor(
        @InjectModel("User")
        userModel: Model<UserSchema>,
        userSchemaFactory: UserSchemaFactory
    ){
        super(userModel, userSchemaFactory);
    }

    async findByEmail(email: string): Promise<User>{
        return await this.findOne({email})
    }

}
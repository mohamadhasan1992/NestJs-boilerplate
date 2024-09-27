import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserSchema } from "../schema/user.schema";
import { BaseEntityRepository } from "@shared/shared";
import { User } from "../../domain/entities/user";
import { IUserSchemaFactory } from "../../domain/adapters/user-schemaFactory.iterface";



@Injectable()
export class UserEntityRepository extends BaseEntityRepository<UserSchema, User>{
    constructor(
        @InjectModel("User")
        userModel: Model<UserSchema>,
        @Inject("UserSchemaFactory")
        userSchemaFactory: IUserSchemaFactory
    ){
        super(userModel, userSchemaFactory);
    }

    async findByEmail(email: string): Promise<User>{
        return await this.findOne({email})
    }

}
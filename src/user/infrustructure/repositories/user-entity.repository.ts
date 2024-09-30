import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserSchema } from "../schema/user.schema";
import { IUserSchemaFactory } from "src/shared/adapters";
import { BaseEntityRepository } from "src/shared";
import { User } from "src/user/domain/entities/user";



@Injectable()
export class UserEntityRepository extends BaseEntityRepository<UserSchema, User>{
    constructor(
        @InjectModel("User")
        userModel: Model<UserSchema>,
        @Inject("UserSchemaFactory")
        userSchemaFactory: IUserSchemaFactory,
    ){
        super(userModel, userSchemaFactory);
    }

    async findByEmail(email: string): Promise<User>{
        return await this.findOne({email})
    }

    async findByPhoneNumber(phone_number: string): Promise<User>{
        return await this.findOne({phone_number})
    }

    async updateRefreshToken(_id: string, token: string){
        const user = await this.findOneById(_id);
        user.setRefreshToken(token)
        return await this.findOneAndReplace({_id}, user)
    }

}
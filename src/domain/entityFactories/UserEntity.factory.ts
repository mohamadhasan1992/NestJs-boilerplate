import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { EntityFactory } from "src/infrustructure/database/entity.factory";
import { User } from "../entities/user";
import { IBcryptService, IUserRepository } from "src/shared/adapters";



@Injectable()
export class UserEntityFactory implements EntityFactory<User>{
    constructor(
        @Inject("UserRepository") 
        private readonly userRepository: IUserRepository,
        @Inject("BcryptService")
        private readonly bcryptService: IBcryptService,
    ){}

    async create(email: string, password: string): Promise<User> {
        const user = new User(
            new Types.ObjectId().toHexString(), 
            email,
            password,
            ""
        )
        const hashedPassword = await this.bcryptService.hash(password);
        user.setPassword(hashedPassword);
        await this.userRepository.create(user)
        return user
    }
}
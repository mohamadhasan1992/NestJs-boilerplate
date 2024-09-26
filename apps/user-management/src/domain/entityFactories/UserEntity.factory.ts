import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "../entities/user";
import { UserStatusEnum } from "../object-values/user-status.enum";
import { IUserRepository } from "../adapters/repository.interface";
import { EntityFactory, IBcryptService } from "@shared/shared";



@Injectable()
export class UserEntityFactory implements EntityFactory<User>{
    constructor(
        @Inject("UserRepository") 
        private readonly userRepository: IUserRepository,
        @Inject("BcryptService")
        private readonly bcryptService: IBcryptService,
    ){}

    async create(fullName: string, email: string, password: string, phone_number: string): Promise<User> {
        const user = new User(
            new Types.ObjectId().toHexString(), 
            fullName, 
            email,
            password,
            phone_number,
            "",
            UserStatusEnum.WaitingForActivation
        )
        const hashedPassword = await this.bcryptService.hash(password);
        user.setPassword(hashedPassword);
        await this.userRepository.create(user)
        return user
    }
}
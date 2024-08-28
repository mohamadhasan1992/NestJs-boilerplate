import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { EntityFactory } from "src/infrustructure/database/entity.factory";
import { User } from "../entities/user";
import { RoleEnum } from "../object-values/Role.enum";
import { UserStatusEnum } from "../object-values/user-status.enum";
import { IBcryptService } from "src/infrustructure/adapters/bcrypt.interface";
import { IUserRepository } from "../adapters/repository.interface";



@Injectable()
export class UserEntityFactory implements EntityFactory<User>{
    constructor(
        @Inject("UserRepository") 
        private readonly userRepository: IUserRepository,
        @Inject("BcryptService")
        private readonly bcryptService: IBcryptService,
    ){}

    async create(fullName: string, email: string, password: string, phone_number: string, role: RoleEnum): Promise<User> {
        const user = new User(
            new Types.ObjectId().toHexString(), 
            fullName, 
            email,
            password,
            phone_number,
            role,
            "",
            UserStatusEnum.WaitingForActivation
        )
        const hashedPassword = await this.bcryptService.hash(password);
        user.setPassword(hashedPassword);
        await this.userRepository.create(user)
        return user
    }
}
import { FilterQuery } from "mongoose";
import { User } from "../entities/user";




export interface IUserRepository {
    create(user: User): Promise<User>;
    findOneAndReplaceById(filterQuery: string, user: User): Promise<User>;
    delete(filterQuery: FilterQuery<User>): Promise<void>;
    findByEmail(email: string): Promise<User|null>;
    findOneById(id: string): Promise<User | null>;
    findOne(filterQuery: FilterQuery<User>): Promise<User|null>,
    findAll(): Promise<User[]>;
    findByPhoneNumber(phone_number: string): Promise<User | null>;
    updateRefreshToken(userId: string, token: string): Promise<User | null>
}

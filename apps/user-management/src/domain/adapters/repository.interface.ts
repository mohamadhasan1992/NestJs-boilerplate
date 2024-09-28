import { FilterQuery } from "mongoose";
import { User } from "../entities/user";
import { IPaginationData } from "@shared/shared/adapters/paginated-data.interface";




export interface IUserRepository {
    create(user: User): Promise<User>;
    findOneAndReplaceById(filterQuery: string, user: User): Promise<User>;
    delete(filterQuery: FilterQuery<User>): Promise<void>;
    findByEmail(email: string): Promise<User|null>;
    findOneById(id: string): Promise<User | null>;
    findOne(filterQuery: FilterQuery<User>): Promise<User|null>,
    findAll(): Promise<IPaginationData<User>>;
}

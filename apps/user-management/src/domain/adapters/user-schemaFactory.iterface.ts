import { UserSchema } from "../../infrustructure/schema/user.schema";
import { User } from "../entities/user";


export interface IUserSchemaFactory{
    create(user: User): UserSchema,
    createFromSchema(user: UserSchema): User
}
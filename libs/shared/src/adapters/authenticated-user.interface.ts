import { RoleEnum } from "src/domain/object-values/Role.enum";
import { UserStatusEnum } from "src/domain/object-values/user-status.enum";



export interface IAuthenticatedUser{
    _id: string;
    email: string;
    phone_number: string;
    status: UserStatusEnum;
    role: RoleEnum;
}
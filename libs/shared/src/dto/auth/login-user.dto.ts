import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";



export class LoginUserDto{
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}
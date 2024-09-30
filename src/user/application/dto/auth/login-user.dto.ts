import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";



export class LoginUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}
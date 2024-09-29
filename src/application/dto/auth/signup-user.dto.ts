import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";



export class SignUpUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}
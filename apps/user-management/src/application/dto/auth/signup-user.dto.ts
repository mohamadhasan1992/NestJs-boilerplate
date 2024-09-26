import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";



export class SignUpUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

}
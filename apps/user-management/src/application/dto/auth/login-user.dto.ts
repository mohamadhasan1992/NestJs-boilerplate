import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";



export class LoginUserDto{
    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}
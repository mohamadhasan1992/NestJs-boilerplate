import {  IsNotEmpty, IsString } from "class-validator";



export class ResendSignupTokenDto{
    @IsString()
    @IsNotEmpty()
    phone_number: string
}
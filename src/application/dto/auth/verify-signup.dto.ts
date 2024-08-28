import { IsNotEmpty, IsString } from "class-validator";



export class VerifySignUpTokenDto{
    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @IsNotEmpty()
    @IsString()
    uuid: string;
}
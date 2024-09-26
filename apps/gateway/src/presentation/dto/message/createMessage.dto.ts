import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto{
    @IsString()
    @IsNotEmpty()
    conversation: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
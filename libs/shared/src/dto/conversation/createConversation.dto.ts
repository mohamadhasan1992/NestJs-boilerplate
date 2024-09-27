import { IsNotEmpty, IsString } from "class-validator";

export class CreateConversationDto{
    @IsString()
    @IsNotEmpty()
    recipient: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}




import { IsNotEmpty, IsString } from "class-validator";



export class UpdateTodoListDto{
    @IsString()
    @IsNotEmpty()
    title: string;

}
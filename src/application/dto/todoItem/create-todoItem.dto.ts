import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PriorityEnum } from "src/domain/object-values/Priority.enum";



export class CreateTodoItemDto{
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    todoList: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(PriorityEnum)
    @IsNotEmpty()
    priority: PriorityEnum;
}
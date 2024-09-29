import { IsEnum, IsOptional, IsString } from "class-validator";
import { PriorityEnum } from "src/domain/object-values/Priority.enum";



export class UpdateTodoItemDto{
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    todoList: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(PriorityEnum)
    @IsOptional()
    priority: PriorityEnum;

}
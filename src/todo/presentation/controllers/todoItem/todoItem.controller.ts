import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FilterQuery } from 'mongoose';
import { CurrentUser, JwtAuthGuard } from 'src/shared';
import { IAuthenticatedUser } from 'src/shared/adapters';
import { CreateTodoItemCommand } from 'src/todo/application/command/impl/todoItem/create-todoItem.command';
import { DeleteTodoItemCommand } from 'src/todo/application/command/impl/todoItem/delete-todoItem-command';
import { UpdateTodoItemCommand } from 'src/todo/application/command/impl/todoItem/update-todoItem.command';
import { CreateTodoItemDto } from 'src/todo/application/dto/todoItem/create-todoItem.dto';
import { UpdateTodoItemDto } from 'src/todo/application/dto/todoItem/update-todoItem.dto';
import { GetTodoItemDetailQuery } from 'src/todo/application/query/impl/todoItem/get-todoItem-detail-query';
import { GetTodoItemQuery } from 'src/todo/application/query/impl/todoList/get-todoList-query';
import { TodoItemSchema } from 'src/todo/infrustructure/schema/todoItem.schema';







@Controller('todo-item')
@UseGuards(JwtAuthGuard)
export class TodoItemController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
) {}


    @Get()
    async getTodoItem(
        @CurrentUser() user: IAuthenticatedUser,
        @Query() filterQuery: FilterQuery<TodoItemSchema>
    ) {
        return await this.queryBus.execute(new GetTodoItemQuery(filterQuery));
    }

    @Get(":id")
    async getTodoItemDetail(
        @CurrentUser() user: IAuthenticatedUser,
        @Param("id") _id: string
    ) {
        return await this.queryBus.execute(new GetTodoItemDetailQuery(_id));
    }

    
    
    @Post()
    async create(
        @Body() createTodoItemDto: CreateTodoItemDto,
        @CurrentUser() user: IAuthenticatedUser,
    ) {
        return await this.commandBus.execute(new CreateTodoItemCommand(createTodoItemDto, user._id))
    }

    @Patch(":id")
    async updateTodoItem(
        @Param("id") id: string,
        @Body() updateTodoItemDto: UpdateTodoItemDto,
        @CurrentUser() user: IAuthenticatedUser,
    ){
        return await this.commandBus.execute(new UpdateTodoItemCommand(id, updateTodoItemDto, user._id))
    }

    @Delete(":id")
    async deleteTodoItem(
        @Param("id") id: string,
        @CurrentUser() user: IAuthenticatedUser,
    ){
        return await this.commandBus.execute(new DeleteTodoItemCommand(id, user._id))
    }



}

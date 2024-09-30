import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FilterQuery } from 'mongoose';
import { CurrentUser, JwtAuthGuard } from 'src/shared';
import { IAuthenticatedUser } from 'src/shared/adapters';
import { CreateTodoListCommand } from 'src/todo/application/command/impl/todoList/create-todoList.command';
import { DeleteTodoListCommand } from 'src/todo/application/command/impl/todoList/delete-todoList-command';
import { UpdateTodoListCommand } from 'src/todo/application/command/impl/todoList/update-todoList.command';
import { CreateTodoListDto } from 'src/todo/application/dto/todoList/create-todoList.dto';
import { UpdateTodoListDto } from 'src/todo/application/dto/todoList/update-todoList.dto';
import { GetTodoListQuery } from 'src/todo/application/query/impl/todoItem/get-todoItem-query';
import { GetTodoListDetailQuery } from 'src/todo/application/query/impl/todoList/get-todoList-detail-query';
import { TodoListSchema } from 'src/todo/infrustructure/schema/todoList.schema';







@Controller('todo-list')
@UseGuards(JwtAuthGuard)
export class TodoListController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
) {}


    @Get()
    async getTodoList(
        @CurrentUser() user: IAuthenticatedUser,
        @Query() filterQuery: FilterQuery<TodoListSchema>
    ) {
        return await this.queryBus.execute(new GetTodoListQuery(filterQuery));
    }

    @Get(":id")
    async getTodoListDetail(
        @CurrentUser() user: IAuthenticatedUser,
        @Param("id") _id: string
    ) {
        return await this.queryBus.execute(new GetTodoListDetailQuery(_id));
    }

    
    
    @Post()
    async create(
        @Body() createTodoListDto: CreateTodoListDto,
        @CurrentUser() user: IAuthenticatedUser,
    ) {
        return await this.commandBus.execute(new CreateTodoListCommand(createTodoListDto, user._id))
    }

    @Patch(":id")
    async updateTodoList(
        @Param("id") id: string,
        @Body() updateTodoListDto: UpdateTodoListDto,
        @CurrentUser() user: IAuthenticatedUser,
    ){
        return await this.commandBus.execute(new UpdateTodoListCommand(id, updateTodoListDto, user._id))
    }

    @Delete(":id")
    async deleteTodoList(
        @Param("id") id: string,
        @CurrentUser() user: IAuthenticatedUser,
    ){
        return await this.commandBus.execute(new DeleteTodoListCommand(id, user._id))
    }



}

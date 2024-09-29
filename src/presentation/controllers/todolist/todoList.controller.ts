import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/presentation/guards/jwtAuth.guard';
import { CurrentUser } from 'src/presentation/decorators/current-user.decorator';
import { FilterQuery } from 'mongoose';
import { IAuthenticatedUser } from 'src/shared/adapters';
import { TodoListSchema } from 'src/infrustructure/schema/todoList.schema';
import { CreateTodoListCommand } from 'src/application/command/impl/todoList/create-todoList.command';
import { UpdateTodoListCommand } from 'src/application/command/impl/todoList/update-todoList.command';
import { UpdateTodoListDto } from 'src/application/dto/todoList/update-todoList.dto';
import { CreateTodoListDto } from 'src/application/dto/todoList/create-todoList.dto';
import { DeleteTodoListCommand } from 'src/application/command/impl/todoList/delete-todoList-command';
import { GetTodoListQuery } from 'src/application/query/impl/todoItem/get-todoItem-query';
import { GetTodoListDetailQuery } from 'src/application/query/impl/todoList/get-todoList-detail-query';







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

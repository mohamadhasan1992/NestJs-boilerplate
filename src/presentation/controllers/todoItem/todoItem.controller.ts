import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/presentation/guards/jwtAuth.guard';
import { CurrentUser } from 'src/presentation/decorators/current-user.decorator';
import { FilterQuery } from 'mongoose';
import { IAuthenticatedUser } from 'src/shared/adapters';
import { TodoItemSchema } from 'src/infrustructure/schema/todoItem.schema';
import { CreateTodoItemDto } from 'src/application/dto/todoItem/create-todoItem.dto';
import { CreateTodoItemCommand } from 'src/application/command/impl/todoItem/create-todoItem.command';
import { UpdateTodoItemDto } from 'src/application/dto/todoItem/update-todoItem.dto';
import { UpdateTodoItemCommand } from 'src/application/command/impl/todoItem/update-todoItem.command';
import { DeleteTodoItemCommand } from 'src/application/command/impl/todoItem/delete-todoItem-command';
import { GetTodoItemQuery } from 'src/application/query/impl/todoList/get-todoList-query';
import { GetTodoItemDetailQuery } from 'src/application/query/impl/todoItem/get-todoItem-detail-query';







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

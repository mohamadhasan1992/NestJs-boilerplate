import { loginCommandHandler } from "./handler/auth/login-command.handler";
import { SignupCommandHandler } from "./handler/auth/signup-command.handler";
import { UpdateRefreshTokenCommandHandler } from "./handler/auth/update-refresh-command.handler";
import { CreateTodoItemCommandHandler } from "./handler/todoItem/create-todoItem-command.handler";
import { DeleteTodoItemCommandHandler } from "./handler/todoItem/delete-todoItem-command.handler";
import { DeleteTodoListAllTodoItemsCommandHandler } from "./handler/todoItem/delete-todoList-all-todoItems-command.handler";
import { UpdateTodoItemCommandHandler } from "./handler/todoItem/update-todoItem-command.handler";
import { CreateTodoListCommandHandler } from "./handler/todoList/create-todoList-command.handler";
import { DeleteTodoListCommandHandler } from "./handler/todoList/delete-todoList-command.handler";
import { UpdateTodoListCommandHandler } from "./handler/todoList/update-todoList-command.handler";




export const CommandHandlers = [
    // AUTH
    loginCommandHandler,
    SignupCommandHandler,
    UpdateRefreshTokenCommandHandler,

    // TODOLIST
    CreateTodoListCommandHandler,
    UpdateTodoListCommandHandler,
    DeleteTodoListCommandHandler,

    // TODOITEM
    CreateTodoItemCommandHandler,
    UpdateTodoItemCommandHandler,
    DeleteTodoItemCommandHandler,
    DeleteTodoListAllTodoItemsCommandHandler
]
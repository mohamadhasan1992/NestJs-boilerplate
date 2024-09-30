import { CreateTodoItemCommandHandler } from "./handler/todoItem/create-todoItem-command.handler";
import { DeleteTodoItemCommandHandler } from "./handler/todoItem/delete-todoItem-command.handler";
import { DeleteTodoListAllTodoItemsCommandHandler } from "./handler/todoItem/delete-todoList-all-todoItems-command.handler";
import { UpdateTodoItemCommandHandler } from "./handler/todoItem/update-todoItem-command.handler";
import { CreateTodoListCommandHandler } from "./handler/todoList/create-todoList-command.handler";
import { DeleteTodoListCommandHandler } from "./handler/todoList/delete-todoList-command.handler";
import { UpdateTodoListCommandHandler } from "./handler/todoList/update-todoList-command.handler";




export const CommandHandlers = [
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
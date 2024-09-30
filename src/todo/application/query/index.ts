import { getTodoItemDetailHandler } from "./handler/todoItem/get-todoItem-detailQuery.handler";
import { getTodoItemQueryHandler } from "./handler/todoItem/get-todoItemQuery.handler";
import { getTodoListDetalHandler } from "./handler/todoList/get-todoList-detailQuery.handler";
import { getTodoListQueryHandler } from "./handler/todoList/get-todoListQuery.handler";





export const QueryHandlers = [
    //TODOLIST
    getTodoListDetalHandler,
    getTodoListQueryHandler,

    //TODOITEM
    getTodoItemDetailHandler,
    getTodoItemQueryHandler
]
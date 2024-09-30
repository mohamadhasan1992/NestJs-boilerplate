import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { DeleteTodoListAllTodoItemsCommand } from "../command/impl/todoItem/delete-todoList-all-todoItem.command";
import { TodoListDeletedEvent } from "src/todo/domain/events/impl/todoList/todoList-deleted.event";



@Injectable()
export class TodoListSagas {
  @Saga()
  todoListDeleted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(TodoListDeletedEvent),
      map((event) => new DeleteTodoListAllTodoItemsCommand(event.todoListId)),
    );
  }
}
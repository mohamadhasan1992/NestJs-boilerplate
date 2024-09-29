import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { TodoListDeletedEvent } from "src/domain/events/impl/todoList/todoList-deleted.event";
import { DeleteTodoListAllTodoItemsCommand } from "../command/impl/todoItem/delete-todoList-all-todoItem.command";



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
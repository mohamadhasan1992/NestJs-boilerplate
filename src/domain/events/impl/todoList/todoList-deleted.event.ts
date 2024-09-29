import { IEvent } from "@nestjs/cqrs";



export class TodoListDeletedEvent implements IEvent{
    constructor(readonly todoListId: string){}
}
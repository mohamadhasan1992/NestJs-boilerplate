import { PriorityEnum } from "../object-values/Priority.enum";



export class TodoItem{
    constructor(
      private readonly _id: string,
      private readonly user: string,
      private todoList: string,
      private title: string,
      private description: string,
      private priority: PriorityEnum,

    ) {}

    getId(){
      return this._id
    }

    getUser(): string{
      return this.user;
    }

    getTitle(): string{
      return this.title;
    }

    getDescription(): string{
      return this.description;
    }

    getTodoList(): string{
      return this.todoList;
    }
    getPriority(): PriorityEnum{
      return this.priority;
    }
    updateDetail(
      title: string,
      description: string,
      priority: PriorityEnum,
      todoList: string
    ) {
      this.title = title || this.title; 
      this.description = description || this.description; 
      this.priority = priority !== undefined && priority !== null ? priority : this.priority
      this.todoList = todoList || this.todoList; 
    }
}
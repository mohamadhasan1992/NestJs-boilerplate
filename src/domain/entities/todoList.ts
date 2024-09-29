import { AggregateRoot } from "@nestjs/cqrs";



export class TodoList extends AggregateRoot{
    constructor(
      private readonly _id: string,
      private readonly user: string,
      private title: string
    ) {
      super()
    }

    getId(){
      return this._id
    }

    getUser(): string{
      return this.user;
    }

    getTitle(): string{
      return this.title;
    }

    updateTitle(title: string){
      this.title = title;
    }

    newTodoListCreated(){
      // this.apply(new UserSignedUpEvent(this._id, this.phone_number));
    }
    DeleteComplete(){
      
    }
}
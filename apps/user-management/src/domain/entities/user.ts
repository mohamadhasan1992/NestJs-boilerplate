import { AggregateRoot } from "@nestjs/cqrs";
import { UserSignedUpEvent } from "../events/impl/auth/user-signed-up-event";


export class User extends AggregateRoot{
    constructor(
      private readonly _id: string,
      private fullName: string,
      private email: string,
      private password: string,
    ) {
      super()
    }

    getId(){
      return this._id
    }

    getFullName(): string{
      return this.fullName;
    }

    getEmail(): string{
      return this.email;
    }

    
    getPassword(): string{
      return this.password;
    }


    setPassword(password: string): void{
      this.password = password;
    }


    userSignedUp(){
      this.apply(new UserSignedUpEvent(this));
    }
}
import { AggregateRoot } from "@nestjs/cqrs";


export class User extends AggregateRoot{
    constructor(
      private readonly _id: string,
      private email: string,
      private password: string,
      private refreshToken: string,
    ) {
      super()
    }

    getId(){
      return this._id
    }

    getEmail(): string{
      return this.email;
    }
    
    getRefreshToken(): string{
      return this.refreshToken;
    }

    getPassword(): string{
      return this.password;
    }
    setRefreshToken(token: string): void{
      this.refreshToken = token;
    }

    setPassword(password: string): void{
      this.password = password;
    }

}
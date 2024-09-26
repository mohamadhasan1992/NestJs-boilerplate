import { AggregateRoot } from "@nestjs/cqrs";
import { UserStatusEnum } from "../object-values/user-status.enum";
import { UserSignedUpEvent } from "../events/impl/auth/user-signed-up-event";


export class User extends AggregateRoot{
    constructor(
      private readonly _id: string,
      private fullName: string,
      private email: string,
      private password: string,
      private phone_number: string,
      private refreshToken: string,
      private status: UserStatusEnum
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

    getPhoneNumber(): string{
        return this.phone_number;
    }
    
    getRefreshToken(): string{
      return this.refreshToken;
    }

    getPassword(): string{
      return this.password;
    }

    getStatus(): UserStatusEnum{
      return this.status;
    }

    setRefreshToken(token: string): void{
      this.refreshToken = token;
    }

    setPassword(password: string): void{
      this.password = password;
    }

    activateUser(): void{
      this.status = UserStatusEnum.Active;
    }

    isNotActive(): boolean{
      return this.status != UserStatusEnum.Active
    }

    sendSignUpEmail(){
      this.apply(new UserSignedUpEvent(this._id, this.phone_number));
    }
}
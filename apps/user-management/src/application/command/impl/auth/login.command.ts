import { LoginUserDto } from "@shared/shared";



export class LoginCommand {
    constructor(
      public readonly loginUserDto: LoginUserDto
    ) {}
}
  

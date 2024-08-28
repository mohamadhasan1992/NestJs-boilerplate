import { LoginUserDto } from "src/application/dto/auth/login-user.dto";



export class LoginCommand {
    constructor(
      public readonly loginUserDto: LoginUserDto
    ) {}
}
  

import { LoginUserDto } from "src/user/application/dto/auth/login-user.dto";



export class LoginCommand {
    constructor(
      public readonly loginUserDto: LoginUserDto
    ) {}
}
  

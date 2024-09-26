import { LoginUserDto } from "../../../dto/auth/login-user.dto";



export class LoginCommand {
    constructor(
      public readonly loginUserDto: LoginUserDto
    ) {}
}
  

import { SignUpUserDto } from "src/user/application/dto/auth/signup-user.dto";



export class SignUpCommand {
    constructor(
      public readonly signUpUserDto: SignUpUserDto
    ) {}
}
  

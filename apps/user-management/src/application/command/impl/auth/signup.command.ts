import { SignUpUserDto } from "../../../dto/auth/signup-user.dto";



export class SignUpCommand {
    constructor(
      public readonly signUpUserDto: SignUpUserDto
    ) {}
}
  

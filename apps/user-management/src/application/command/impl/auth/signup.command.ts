import { SignUpUserDto } from "@shared/shared";



export class SignUpCommand {
    constructor(
      public readonly signUpUserDto: SignUpUserDto
    ) {}
}
  

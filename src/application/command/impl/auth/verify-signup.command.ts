import { VerifySignUpTokenDto } from "src/application/dto/auth/verify-signup.dto";



export class VerifySignupTokenCommand {
    constructor(
      public readonly verifySignUpTokenDto: VerifySignUpTokenDto
    ) {}
}
  

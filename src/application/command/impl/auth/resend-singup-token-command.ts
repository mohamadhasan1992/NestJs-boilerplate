import { ResendSignupTokenDto } from "src/application/dto/auth/resend-singup-token.dto";



export class ResendsignUpTokenCommand {
    constructor(
      public readonly resendSignupTokenDto: ResendSignupTokenDto
    ) {}
}
  

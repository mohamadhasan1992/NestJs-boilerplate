import { loginCommandHandler } from "./handler/auth/login-command.handler";
import { ResendsignUpTokenCommandHandler } from "./handler/auth/resend-signup-token-command.handler";
import { SignupCommandHandler } from "./handler/auth/signup-command.handler";
import { UpdateRefreshTokenCommandHandler } from "./handler/auth/update-refresh-command.handler";
import { VerifySignUpTokenCommandHandler } from "./handler/auth/verify-signup-command.handler";




export const CommandHandlers = [
    loginCommandHandler,
    SignupCommandHandler,
    ResendsignUpTokenCommandHandler,
    UpdateRefreshTokenCommandHandler,
    VerifySignUpTokenCommandHandler
]
import { loginCommandHandler } from "./handler/auth/login-command.handler";
import { SignupCommandHandler } from "./handler/auth/signup-command.handler";




export const CommandHandlers = [
    loginCommandHandler,
    SignupCommandHandler,
]
import { loginCommandHandler } from "./handler/auth/login-command.handler";
import { SignupCommandHandler } from "./handler/auth/signup-command.handler";
import { UpdateRefreshTokenCommandHandler } from "./handler/auth/update-refresh-command.handler";



export const CommandHandlers = [
    // AUTH
    loginCommandHandler,
    SignupCommandHandler,
    UpdateRefreshTokenCommandHandler,

]
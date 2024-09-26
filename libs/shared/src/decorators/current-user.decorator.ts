import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IAuthenticatedUser } from "../adapters";



const getCurrentUserByContext = (context: ExecutionContext): IAuthenticatedUser => {
    return context.switchToHttp().getRequest()?.user;
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)
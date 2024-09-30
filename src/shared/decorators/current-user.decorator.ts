import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserSchema } from "src/user/infrustructure/schema/user.schema";



const getCurrentUserByContext = (context: ExecutionContext): UserSchema => {
    return context.switchToHttp().getRequest()?.user;
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)
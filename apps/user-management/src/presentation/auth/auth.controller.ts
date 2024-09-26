import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpUserDto } from '../../application/dto/auth/signup-user.dto';
import { SignUpCommand } from '../../application/command/impl/auth/signup.command';
import { LoginUserDto } from '../../application/dto/auth/login-user.dto';
import { LoginCommand } from '../../application/command/impl/auth/login.command';
import { AuthServiceController, AuthServiceControllerMethods, GetUserRequest } from '@shared/shared/proto/user';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetMeQuery } from '../../application/query/impl/auth/get-me-query';
import { Controller } from '@nestjs/common';







@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
) {}



    @MessagePattern('signup-user')
    async signup(@Payload() signUpUserDto: SignUpUserDto) {
        return await this.commandBus.execute(new SignUpCommand(signUpUserDto))
    }

    @MessagePattern('login-user')
    async login(
        @Payload() loginUserDto: LoginUserDto,
    ) {
        const {accessTokenCookie: accessToken, refreshTokenCookie: refreshToken} = await this.commandBus.execute(new LoginCommand(loginUserDto))
        return {
            accessToken,
            refreshToken
        }
    }

    async getMe(
        @Payload() getUserRequest: GetUserRequest
    ) {
        const {userId} = getUserRequest;
        return await this.queryBus.execute(new GetMeQuery(userId));
    }

}

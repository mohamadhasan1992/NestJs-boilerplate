import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthServiceController, AuthServiceControllerMethods, GetUserByEmailRequest, GetUserRequest } from '@shared/shared/proto/user';
import { Payload } from '@nestjs/microservices';
import { GetMeQuery } from '../../application/query/impl/auth/get-me-query';
import { Body, Controller, Post } from '@nestjs/common';
import { GetUserByEmailQuery } from '../../application/query/impl/auth/get-user-by-email.query';
import { LoginUserDto, SignUpUserDto } from '@shared/shared';
import { SignUpCommand } from '../../application/command/impl/auth/signup.command';
import { LoginCommand } from '../../application/command/impl/auth/login.command';







@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
) {}



    // http request if exposed
    @Post('signup')
    async signup(
        @Body() signUpUserDto: SignUpUserDto
    ) {
        return await this.commandBus.execute(new SignUpCommand(signUpUserDto))        
    }

    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
    ) {
        const accessToken = await this.commandBus.execute(new LoginCommand(loginUserDto))
        return {
            accessToken
        }
    }

    async getMe(
        @Payload() getUserRequest: GetUserRequest
    ) {
        const {userId} = getUserRequest;
        return await this.queryBus.execute(new GetMeQuery(userId));
    }

    async getUserByEmail(
        @Payload() {email}: GetUserByEmailRequest
    ) {
        return await this.queryBus.execute(new GetUserByEmailQuery(email));
    }

}

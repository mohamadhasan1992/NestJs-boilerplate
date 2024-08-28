import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from 'src/application/command/impl/auth/login.command';
import { SignUpCommand } from 'src/application/command/impl/auth/signup.command';
import { LoginUserDto } from 'src/application/dto/auth/login-user.dto';
import { SignUpUserDto } from 'src/application/dto/auth/signup-user.dto';







@Controller('crm/auth')
export class CrmAuthController {
  constructor(
    private readonly commandBus: CommandBus,
) {}

    
    @Post("signup")
    async signup(@Body() signUpUserDto: SignUpUserDto) {
        return await this.commandBus.execute(new SignUpCommand(signUpUserDto))
    }

    @Post("login")
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.commandBus.execute(new LoginCommand(loginUserDto))
    }

    @Get('me')
    getMe(
        // @CurrentUser() user: IAuthenticatedUser
    ) {
        return "me";
    }

}

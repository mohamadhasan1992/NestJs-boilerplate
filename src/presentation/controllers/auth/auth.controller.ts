import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { LoginCommand } from 'src/application/command/impl/auth/login.command';
import { SignUpCommand } from 'src/application/command/impl/auth/signup.command';
import { LoginUserDto } from 'src/application/dto/auth/login-user.dto';
import { JwtAuthGuard } from 'src/presentation/guards/jwtAuth.guard';
import { LoginGuard } from 'src/presentation/guards/login.guard';
import { CurrentUser } from 'src/presentation/decorators/current-user.decorator';
import { IAuthenticatedUser } from 'src/shared/adapters';
import { SignUpUserDto } from 'src/application/dto/auth/signup-user.dto';







@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
) {}

    
    @Post("signup")
    async signup(@Body() signUpUserDto: SignUpUserDto) {
        return await this.commandBus.execute(new SignUpCommand(signUpUserDto))
    }


    @Post("login")
    @UseGuards(LoginGuard)
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() response: Response
    ) {
        const {accessTokenCookie, refreshTokenCookie} = await this.commandBus.execute(new LoginCommand(loginUserDto))
        this.setHeaders(response, 'Authentication', accessTokenCookie)
        this.setHeaders(response, 'Refresh', refreshTokenCookie)
        response.send({
            message: "SUCCESS.LOGEDIN"
        });
    }


    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(
        @CurrentUser() user: IAuthenticatedUser
    ) {
        return user;
    }


    @Post("logout")
    @UseGuards(JwtAuthGuard)
    async logout(
        @Res() response: Response
    ){
        response.clearCookie("Authentication");
        response.clearCookie("Refresh");
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.setHeaders(response, 'Authentication', "removed")
        this.setHeaders(response, 'Refresh', "removed")
        response.send({
            message: "success.LOGEDOUT"
        })
    }


    setHeaders(response: Response, identifier: string, token: string){
        return response.cookie(identifier, token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }) 
    }

}

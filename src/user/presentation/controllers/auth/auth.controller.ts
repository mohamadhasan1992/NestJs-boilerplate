import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { CurrentUser, IAuthenticatedUser, JwtAuthGuard, LoginGuard } from 'src/shared';
import { LoginCommand } from 'src/user/application/command/impl/auth/login.command';
import { SignUpCommand } from 'src/user/application/command/impl/auth/signup.command';
import { LoginUserDto } from 'src/user/application/dto/auth/login-user.dto';
import { SignUpUserDto } from 'src/user/application/dto/auth/signup-user.dto';
import { GetMeQuery } from 'src/user/application/query/impl/auth/get-me-query';







@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
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
    async getMe(
        @CurrentUser() user: IAuthenticatedUser
    ) {
        return await this.queryBus.execute(new GetMeQuery(user._id))
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

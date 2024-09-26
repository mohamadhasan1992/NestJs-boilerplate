import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { SignUpUserDto } from '../../application/dto/auth/signup-user.dto';
import { SignUpCommand } from '../../application/command/impl/auth/signup.command';
import { ResendSignupTokenDto } from '../../application/dto/auth/resend-singup-token.dto';
import { ResendsignUpTokenCommand } from '../../application/command/impl/auth/resend-singup-token-command';
import { VerifySignUpTokenDto } from '../../application/dto/auth/verify-signup.dto';
import { VerifySignupTokenCommand } from '../../application/command/impl/auth/verify-signup.command';
import { LoginGuard } from '../guards/login.guard';
import { LoginUserDto } from '../../application/dto/auth/login-user.dto';
import { LoginCommand } from '../../application/command/impl/auth/login.command';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { CurrentUser, IAuthenticatedUser } from '@shared/shared';
import JwtRefreshGuard from '../guards/jwtRefresh.guard';
import { UpdateRefreshTokenCommand } from '../../application/command/impl/auth/update-refresh-token-command';







@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
) {}

    
    @Post("signup")
    async signup(@Body() signUpUserDto: SignUpUserDto) {
        return await this.commandBus.execute(new SignUpCommand(signUpUserDto))
    }

    @Post("resend-token")
    async resendSignupToken(@Body() resendSignupTokenDto: ResendSignupTokenDto) {
        return await this.commandBus.execute(new ResendsignUpTokenCommand(resendSignupTokenDto))
    }

    @Post("verify-token")
    async verifySignUpToken(
        @Body() verifySignUpTokenDto: VerifySignUpTokenDto,
        @Res() response: Response    
    ){
        const {accessTokenCookie, refreshTokenCookie} = await this.commandBus.execute(new VerifySignupTokenCommand(verifySignUpTokenDto))
        this.setHeaders(response, 'Authentication', accessTokenCookie)
        this.setHeaders(response, 'Refresh', refreshTokenCookie)
        response.send({
            message: "SUCCESS.LOGEDIN"
        });
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

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @CurrentUser() user: IAuthenticatedUser,
        @Res() response: Response) {
        const {accessTokenCookie} = await this.commandBus.execute(new UpdateRefreshTokenCommand({userId: user._id}))
        this.setHeaders(response, "Authentication", accessTokenCookie)
        response.send({
            message: "success.REFRESH"
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

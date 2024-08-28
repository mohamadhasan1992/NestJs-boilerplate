import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { LoginCommand } from 'src/application/command/impl/auth/login.command';
import { ResendsignUpTokenCommand } from 'src/application/command/impl/auth/resend-singup-token-command';
import { SignUpCommand } from 'src/application/command/impl/auth/signup.command';
import { UpdateRefreshTokenCommand } from 'src/application/command/impl/auth/update-refresh-token-command';
import { VerifySignupTokenCommand } from 'src/application/command/impl/auth/verify-signup.command';
import { LoginUserDto } from 'src/application/dto/auth/login-user.dto';
import { ResendSignupTokenDto } from 'src/application/dto/auth/resend-singup-token.dto';
import { SignUpUserDto } from 'src/application/dto/auth/signup-user.dto';
import { VerifySignUpTokenDto } from 'src/application/dto/auth/verify-signup.dto';
import { JwtAuthGuard } from 'src/application/guards/jwtAuth.guard';
import JwtRefreshGuard from 'src/application/guards/jwtRefresh.guard';
import { LoginGuard } from 'src/application/guards/login.guard';
import { IAuthenticatedUser } from 'src/infrustructure/adapters/authenticated-user.interface';
import { CurrentUser } from 'src/infrustructure/decorators/current-user.decorator';







@Controller('panel/auth')
export class PanelAuthController {
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

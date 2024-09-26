import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { JwtAuthGuard } from '../../infrustructure/auth/guards/jwt-auth.guard';
import { SignUpUserDto } from '../dto/auth/signup-user.dto';
import { LoginUserDto } from '../dto/auth/login-user.dto';
import { CurrentUser, IAuthenticatedUser } from '@shared/shared';





@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("signup")
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    return await this.authService.sinupUser(signUpUserDto)
  }

  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: IAuthenticatedUser) {
    return user;
  }

  
}

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IAuthenticatedUser, IBcryptService, ILogger } from '@shared/shared';
import { AuthService } from '../../application/services/auth.service';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GetUserByEmailResponse } from '@shared/shared/proto/user';



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject("LoggerService")
    private readonly logger: ILogger,
    private readonly authService: AuthService,
    @Inject("BcryptService")
    private readonly bcryptService: IBcryptService,
    private readonly i18nService: I18nService
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log("validate", email)
    if (!email || !password) {
      this.logger.warn('LocalStrategy', `email or password is missing, BadRequestException`);
      throw new BadRequestException(this.i18nService.t("USER_NOT_FOUND"))
    }

    try {
      const user: IAuthenticatedUser = await lastValueFrom(
          (await this.authService.getUserByEmail(email)).pipe(
              map(async(user: GetUserByEmailResponse) => {
                  if (!user) {
                    return null;
                  }
                  const userPass = user.password;
                  const match = await this.bcryptService.compare(password, userPass);
                  if (user && match) {
                    return {
                      _id: user.ID,
                      email: user.email,
                    };
                  }
                  return null;
              }),
              catchError(error => {
                  throw new UnauthorizedException(error.message);
              })
          )
      );
      return user;
  } catch (error) {
      throw new UnauthorizedException(error.message);
  }
  }
}

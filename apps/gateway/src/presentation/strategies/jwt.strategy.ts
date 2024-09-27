import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { IAuthenticatedUser, IJwtServicePayload, ILogger } from '@shared/shared';
import { AuthService } from '../../application/services/auth.service';
import { GetUserResponse } from '@shared/shared/proto/user';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CACHE_MANAGER, Cache} from '@nestjs/cache-manager';
import { JWTConfig } from '@shared/shared/adapters/jwt.interface';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject("LoggerService")
    private readonly logger: ILogger,
    @Inject("EnvironmentConfigService")
    private readonly environmentConfigService: JWTConfig,
    private readonly authService: AuthService,
    private readonly i18nService: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return this.extractTokenFromHeader(request) || request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: environmentConfigService.getJwtSecret(),
    });
  }

  async validate(payload: IJwtServicePayload) {
    // check for cached
     const cachedUser: string = await this.cacheManager.get(payload.userId);
     if(cachedUser){
         return cachedUser
     }
    const user: IAuthenticatedUser = await lastValueFrom(
      (await this.authService.getUser(payload.userId)).pipe(
          map(({user}: GetUserResponse) => {
              if(!user){
                return null
              }
              return {
                _id: user.ID,
                email: user.email
              };
          }),
          catchError(error => {
              throw new UnauthorizedException(error.message);
          })
      )
    );
    if (!user) {
      return null;
    }
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`);
      throw new UnauthorizedException(this.i18nService.t('error.USER_NOT_FOUND'))
    }
    return {
      _id: user._id,
      email: user.email,
    };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    console.log(type, token)
    return type === 'Bearer' ? token : undefined;
}
}

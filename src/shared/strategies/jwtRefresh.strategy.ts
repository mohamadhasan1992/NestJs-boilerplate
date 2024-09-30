import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { IBcryptService, IUserRepository, JWTConfig, TokenPayload } from 'src/shared/adapters';
import { LoggerService } from '../logger';



@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    @Inject("JwtConfig")
    private readonly jwtConfig: JWTConfig,
    private readonly logger: LoggerService,
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("BcryptService")
    private readonly bcryptService: IBcryptService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: jwtConfig.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    const user = await this.userRepository.findOneById(payload.userId);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(refreshToken, user.getRefreshToken());
    if (isRefreshTokenMatching) {
      return {
        _id: user.getId(),
        email: user.getEmail(),
      };;
    }else{
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      throw new UnauthorizedException('error.REFRESH_TKONE_UNVALID');
    }

  }
}

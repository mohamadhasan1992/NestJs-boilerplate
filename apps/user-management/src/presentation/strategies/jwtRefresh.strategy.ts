import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { IConfigService } from '../adapters/config-service.interface';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { IUserRepository } from '../../domain/adapters/repository.interface';
import { IBcryptService, TokenPayload } from '@shared/shared';



@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    @Inject("ConfigService")
    private readonly configService: IConfigService,
    private readonly logger: LoggerService,
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("BcryptService")
    private readonly bcryptService: IBcryptService,
    private readonly i18nService: I18nService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
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
        phone_number: user.getPhoneNumber(),
        status: user.getStatus(),
      };
    }else{
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      throw new UnauthorizedException(this.i18nService.t('error.REFRESH_TKONE_UNVALID'));
    }

  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { IUserRepository } from '../../domain/adapters/repository.interface';
import { TokenPayload } from '@shared/shared';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: LoggerService,
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    private readonly i18nService: I18nService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userRepository.findOneById(payload.userId);
    if (!user) {
      return null;
    }
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`);
      throw new UnauthorizedException(this.i18nService.t('error.USER_NOT_FOUND'))
    }
    return {
      _id: user.getId(),
      email: user.getEmail(),
      phone_number: user.getPhoneNumber(),
      status: user.getStatus(),
      role: user.getRole()
    };
  }
}

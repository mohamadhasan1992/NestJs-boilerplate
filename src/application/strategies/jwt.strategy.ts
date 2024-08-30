import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from 'src/infrustructure/logger/logger.service';
import { TokenPayload } from 'src/infrustructure/adapters/token-payload.interface';
import { IUserRepository } from 'src/domain/adapters/repository.interface';
import { I18nService } from 'nestjs-i18n';



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

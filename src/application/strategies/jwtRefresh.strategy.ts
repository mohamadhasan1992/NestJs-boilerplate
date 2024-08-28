import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { EnvironmentConfigService } from 'src/infrustructure/config/environment-config.service';
import { LoggerService } from 'src/infrustructure/logger/logger.service';
import { TokenPayload } from 'src/infrustructure/adapters/token-payload.interface';
import { IBcryptService } from 'src/infrustructure/adapters/bcrypt.interface';
import { IUserRepository } from 'src/domain/adapters/repository.interface';



@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: EnvironmentConfigService,
    private readonly logger: LoggerService,
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("BcryptService")
    private readonly bcryptService: IBcryptService
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
        role: user.getRole()
      };;
    }else{
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      throw new UnauthorizedException({ message: 'error.REFRESH_TKONE_UNVALID' });
    }

  }
}

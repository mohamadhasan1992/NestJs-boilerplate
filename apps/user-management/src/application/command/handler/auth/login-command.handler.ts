import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LoginCommand } from '../../impl/auth/login.command';
import { IUserRepository } from 'apps/user-management/src/domain/adapters/repository.interface';
import { IBcryptService, IJwtService, IJwtServicePayload } from '@shared/shared';
import { JWTConfig } from 'apps/user-management/src/domain/adapters/jwt.interface';




@CommandHandler(LoginCommand)
export class loginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("JwtService")
    private readonly jwtTokenService: IJwtService,
    @Inject("JwtConfig")
    private readonly jwtConfig: JWTConfig,
    @Inject("BcryptService")
    private readonly bcryptService: IBcryptService
  ) {}

  async execute({loginUserDto}: LoginCommand){
    const {
      phone_number,
    } = loginUserDto;
    // find user
    const user = await this.userRepository.findByPhoneNumber(phone_number);
    const payload: IJwtServicePayload = { userId: user.getId() };
    const jwtSecret = this.jwtConfig.getJwtSecret();
    const jwtExpiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, jwtSecret, jwtExpiresIn);
    
    const refreshSecret = this.jwtConfig.getJwtRefreshSecret();
    const refreshExpiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const refreshToken = this.jwtTokenService.createToken(payload, refreshSecret, refreshExpiresIn);
    await this.setCurrentRefreshToken(refreshToken, user.getId());
    return { accessTokenCookie: token, refreshTokenCookie: refreshToken };
  }


  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(refreshToken);
    await this.userRepository.updateRefreshToken(userId, currentHashedRefreshToken);
  }
}

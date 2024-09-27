import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LoginCommand } from '../../impl/auth/login.command';
import { IUserRepository } from 'apps/user-management/src/domain/adapters/repository.interface';
import { IJwtService, IJwtServicePayload } from '@shared/shared';
import { JWTConfig } from 'apps/user-management/src/domain/adapters/jwt.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';




@CommandHandler(LoginCommand)
export class loginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("JwtService")
    private readonly jwtTokenService: IJwtService,
    @Inject("EnvironmentConfigService")
    private readonly environmentConfigService: JWTConfig,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({loginUserDto}: LoginCommand){
    const {
      email,
    } = loginUserDto;
    // find user
    const user = await this.userRepository.findByEmail(email);
    const payload: IJwtServicePayload = { userId: user.getId() };
    const jwtSecret = this.environmentConfigService.getJwtSecret();
    const jwtExpiresIn = this.environmentConfigService.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, jwtSecret, jwtExpiresIn);
    
    // cache user
    await this.cacheManager.set(
      user.getId(),
      {
        _id: user.getId(),
        email: user.getEmail(),
        fullName: user.getFullName()
      }, 
      parseInt(this.environmentConfigService.getJwtExpirationTime()))
    return { accessToken: token };
  }


}

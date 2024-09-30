import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IBcryptService, IUserRepository } from 'src/shared/adapters';
import { LoggerService } from '../logger';



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: LoggerService,
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("BcryptService")
    private readonly bcryptService: IBcryptService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      this.logger.warn('LocalStrategy', `phone_number or password is missing, BadRequestException`);
      throw new BadRequestException("error.USER_NOT_FOUND")
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    const userPass = user.getPassword();
    const match = await this.bcryptService.compare(password, userPass);
    if (user && match) {
      return {
        _id: user.getId(),
        email: user.getEmail(),
      };
    }
    return null;

  }
}

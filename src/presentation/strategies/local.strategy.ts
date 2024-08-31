import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/infrustructure/logger/logger.service';
import { IBcryptService } from 'src/infrustructure/adapters/bcrypt.interface';
import { IUserRepository } from 'src/domain/adapters/repository.interface';
import { I18nService } from 'nestjs-i18n';



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: LoggerService,
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("BcryptService")
    private readonly bcryptService: IBcryptService,
    private readonly i18nService: I18nService
  ) {
    super({ usernameField: 'phone_number' });
  }

  async validate(phone_number: string, password: string) {
    if (!phone_number || !password) {
      this.logger.warn('LocalStrategy', `phone_number or password is missing, BadRequestException`);
      throw new BadRequestException(this.i18nService.t("USER_NOT_FOUND"))
    }

    const user = await this.userRepository.findByPhoneNumber(phone_number);
    if (!user) {
      return null;
    }
    if(user.isNotActive()){
      throw new UnauthorizedException(this.i18nService.t("error.ACTIVATE_ACCOUNT_FIRST"))
    }
    const userPass = user.getPassword();
    const match = await this.bcryptService.compare(password, userPass);
    if (user && match) {
      return {
        _id: user.getId(),
        fullName: user.getFullName(),
        phone_number: user.getPhoneNumber()
      };
    }
    return null;

  }
}

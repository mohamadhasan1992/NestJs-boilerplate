import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SignUpCommand } from '../../impl/auth/signup.command';
import { IUserRepository } from 'apps/user-management/src/domain/adapters/repository.interface';
import { UserEntityFactory } from 'apps/user-management/src/domain/entityFactories/UserEntity.factory';




@CommandHandler(SignUpCommand)
export class SignupCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    private readonly userEntityFactory: UserEntityFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly i18nService: I18nService
  ) {}

  async execute({signUpUserDto}: SignUpCommand): Promise<any> {
    const {
      fullName,
      email,
      password,
    } = signUpUserDto;
    const ifUserExists = await this.userRepository.findByEmail(email);
    if(ifUserExists){
      throw new BadRequestException(
        this.i18nService.t(
          "error.USER_ALREADY_EXISTS"
        )
      )
    }

    // create user
    const newUser = this.eventPublisher.mergeObjectContext(
      await this.userEntityFactory.create(fullName, email, password)
    );
    newUser.userSignedUp();
    newUser.commit();
    
    return {
      message: 
      this.i18nService.t(
        "success.SIGNUPED_SUCCESSFULLY"
      ),
    }
  }
}

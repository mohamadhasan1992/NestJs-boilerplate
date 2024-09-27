import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
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
        "error.USER_ALREADY_EXISTS"
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
      "success.SIGNUPED_SUCCESSFULLY"
    }
  }
}

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { SignUpCommand } from '../../impl/auth/signup.command';
import { IUserEntityFactory, IUserRepository } from 'shared/adapters';




@CommandHandler(SignUpCommand)
export class SignupCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("UserEntityFactory")
    private readonly userFactory: IUserEntityFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({signUpUserDto}: SignUpCommand): Promise<any> {
    const {
      email,
      password,
    } = signUpUserDto;
    const ifUserExists = await this.userRepository.findByEmail(email);

    if(!!ifUserExists){
      throw new BadRequestException(
        "error.USER_ALREADY_EXISTS"
      )
    }

    // create user
    const newUser = this.eventPublisher.mergeObjectContext(
      await this.userFactory.create(email, password)
    );
    newUser.commit();
    
    return {
      message: 
      "success.SIGNUPED_SUCCESSFULLY"
    }
  }
}

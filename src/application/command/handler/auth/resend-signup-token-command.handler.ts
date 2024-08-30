import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/domain/adapters/repository.interface';
import { ResendsignUpTokenCommand } from '../../impl/auth/resend-singup-token-command';
import { UserEntityFactory } from 'src/domain/entityFactories/UserEntity.factory';
import { I18nService } from 'nestjs-i18n';




@CommandHandler(ResendsignUpTokenCommand)
export class ResendsignUpTokenCommandHandler implements ICommandHandler<ResendsignUpTokenCommand> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserEntityFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly i18nService: I18nService
  ) {}

  async execute({resendSignupTokenDto}: ResendsignUpTokenCommand): Promise<any> {
    const {
      phone_number,
    } = resendSignupTokenDto;
    const user = this.eventPublisher.mergeObjectContext(
      await this.userRepository.findByPhoneNumber(phone_number)
    );
    if(!user){
      throw new BadRequestException(
        this.i18nService.t(
          "error.USER_NOT_FOUND"
        )
      )
    }

    // create user
    user.sendSignUpEmail();
    user.commit();
    
    return {
      message: 
      this.i18nService.t(
        "success.TOKEN_SEND"
      ),
    }
  }
}

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IMessageRepository } from 'apps/messenger/src/domain/adapters/repository.interface';
import { DeleteMessageCommand } from '../../impl/message/delete-message.command';




@CommandHandler(DeleteMessageCommand)
export class DeleteMessageCommandHandler implements ICommandHandler<DeleteMessageCommand> {
  constructor(
    @Inject("MessageRepository")
    private readonly messageRepository: IMessageRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({user, id}: DeleteMessageCommand){
    // find conversation
    const message = await this.messageRepository.findOne({_id: id});
    if(!message){
      throw new NotFoundException("error.MESSAGE_NOT_FOUND")
    }
    if(message.getSender() != user){
      throw new BadRequestException("error.MESSAGE_NOT_YOURS")
    }
    // create message using conversation id
    const deletedMessage = this.eventPublisher.mergeObjectContext(
      await this.messageRepository.findByIdAndDelete(message.getId())
    );
    // attach message as last message to conersation
    deletedMessage.messageDeleted()
    return deletedMessage;
  }


}

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IConversationRepository } from 'apps/messenger/src/domain/adapters/repository.interface';
import { DeleteConversationCommand } from '../../impl/conversation/delete-conversation.command';




@CommandHandler(DeleteConversationCommand)
export class DeleteConversationCommandHandler implements ICommandHandler<DeleteConversationCommand> {
  constructor(
    @Inject("ConversationRepository")
    private readonly conversationRepository: IConversationRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({user, conversationId}: DeleteConversationCommand){
    // find conversation
    const conversation = await this.conversationRepository.findOne({_id: conversationId});
    if(!conversation){
      throw new NotFoundException("error.CONVERSATION_NOT_FOUND")
    }
    if(conversation.getCreator() != user && conversation.getRecipient() != user){
      throw new BadRequestException("error.CONVERSATION_NOT_YOURS")
    }
    // create message using conversation id
    const deletedConversation = this.eventPublisher.mergeObjectContext(
      await this.conversationRepository.findByIdAndDelete(conversation.getId())
    );
    // attach message as last message to conersation
    deletedConversation.conversationDeleted()
    return deletedConversation;
  }


}

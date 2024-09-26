import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IConversationRepository } from 'apps/messenger/src/domain/adapters/repository.interface';
import { MessageEntityFactory } from 'apps/messenger/src/domain/entityFactories/MessageEntity.factory';
import mongoose from 'mongoose';
import { CreateMessageCommand } from '../../impl/message/create-message.command';




@CommandHandler(CreateMessageCommand)
export class CreateMessageCommandHandler implements ICommandHandler<CreateMessageCommand> {
  constructor(
    @Inject("ConversationRepository")
    private readonly conversationRepository: IConversationRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly messageEntityFactory: MessageEntityFactory,
  ) {}

  async execute({user, createMessageDto}: CreateMessageCommand){
    const {
      conversation,
      content,
    } = createMessageDto;
    // find conversation
    const messageConversation = await this.conversationRepository.findOne({_id: conversation});
    if(!messageConversation){
      throw new NotFoundException("error.CONVERSATION_NOT_FOUND")
    }
    // create message using conversation id
    const newMessage = this.eventPublisher.mergeObjectContext(
      await this.messageEntityFactory.create(messageConversation.getId(), user, content)
    );
    // attach message as last message to conersation
    messageConversation.addLastMessageToConversation(newMessage.getId())
    await this.conversationRepository.findByIdAndReplace(
      messageConversation.getId() as unknown as mongoose.Types.ObjectId, 
      messageConversation
    )
    newMessage.newMessageCreated()
    return newMessage;
  }


}

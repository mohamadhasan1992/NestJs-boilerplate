import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateConversationCommand } from '../../impl/conversation/create-conversation.command';
import { IConversationRepository } from 'apps/messenger/src/domain/adapters/repository.interface';
import { ConversationEntityFactory } from 'apps/messenger/src/domain/entityFactories/ConversationEntity.factory';
import { MessageEntityFactory } from 'apps/messenger/src/domain/entityFactories/MessageEntity.factory';




@CommandHandler(CreateConversationCommand)
export class CreateConversationCommandHandler implements ICommandHandler<CreateConversationCommand> {
  constructor(
    @Inject("ConversationRepository")
    private readonly conversationRepository: IConversationRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly conversationEntityFactory: ConversationEntityFactory,
    private readonly messageEntityFactory: MessageEntityFactory
  ) {}

  async execute({user, createConversationDto}: CreateConversationCommand){
    const {
      recipient,
      content,
    } = createConversationDto;
    // create conversation
    const newConversation = await this.conversationEntityFactory.create(user, recipient, null)
    // create message using conversation id
    const newMessage = this.eventPublisher.mergeObjectContext(
      await this.messageEntityFactory.create(newConversation.getId(), user, content)
    );
    // attach message as last message to conersation
    newConversation.addLastMessageToConversation(newMessage.getId())
    await this.conversationRepository.findByIdAndReplace(
      newConversation.getId(), 
      newConversation
    )
    newConversation.newConversationCreated()
    return newConversation;
  }


}

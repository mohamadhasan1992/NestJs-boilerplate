import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IConversationRepository } from 'apps/messenger/src/domain/adapters/repository.interface';
import { GetMessageQuery } from '../../impl/message/get-message-query';




@QueryHandler(GetMessageQuery)
export class getMessageQueryHandler implements IQueryHandler<GetMessageQuery> {
  constructor(
    @Inject("MessageRepository")
    private readonly conversationRepository: IConversationRepository
  ) {}

  async execute({user, conversation, filterQuery}: GetMessageQuery) {
    delete filterQuery.conversation
    return await this.conversationRepository.findAll({
      ...filterQuery,
      sender: user,
      conversation,
    });
  }
}

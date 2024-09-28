import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IMessageRepository } from 'apps/messenger/src/domain/adapters/repository.interface';
import { GetMessageQuery } from '../../impl/message/get-message-query';




@QueryHandler(GetMessageQuery)
export class getMessageQueryHandler implements IQueryHandler<GetMessageQuery> {
  constructor(
    @Inject("MessageRepository")
    private readonly messageRepository: IMessageRepository
  ) {}

  async execute({user, conversation, filterQuery}: GetMessageQuery) {
    delete filterQuery.conversation
    return await this.messageRepository.findAll({
      ...filterQuery,
      sender: user,
      conversation,
    });
  }
}

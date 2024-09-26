import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetConversationQuery } from '../../impl/conversation/get-conversation-query';
import { IConversationRepository } from 'apps/messenger/src/domain/adapters/repository.interface';




@QueryHandler(GetConversationQuery)
export class getConversationQueryHandler implements IQueryHandler<GetConversationQuery> {
  constructor(
    @Inject("ConversationRepository")
    private readonly conversationRepository: IConversationRepository
  ) {}

  async execute({user, filterQuery}: GetConversationQuery) {
    delete filterQuery.creator
    delete filterQuery.recipient
    return await this.conversationRepository.findAll({
      $or:[
        {creator: user},
        {recipient: user},
      ],
      ...filterQuery
    },[
      {
        path: "last_message",
        model: "Message" 
      }
    ]);
  }
}

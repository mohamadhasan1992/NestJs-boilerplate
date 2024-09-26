import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ConversationDeletedEvent } from 'apps/messenger/src/domain/event/conversation/conversation-deleted.event';



@Injectable()
@EventsHandler(ConversationDeletedEvent)
export class ConversationDeletedEventHandler implements IEventHandler<ConversationDeletedEvent> {
  constructor(

) {}

  async handle(conversation: ConversationDeletedEvent): Promise<void> {
    console.log("new conversation deleted", conversation)
    return;
  }
}

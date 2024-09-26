import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ConversationCreatedEvent } from 'apps/messenger/src/domain/event/conversation/conversation-created.event';



@Injectable()
@EventsHandler(ConversationCreatedEvent)
export class ConversationCreatedEventHandler implements IEventHandler<ConversationCreatedEvent> {
  constructor(

) {}

  async handle(conversation: ConversationCreatedEvent): Promise<void> {
    console.log("new conversation created", conversation)
    return;
  }
}

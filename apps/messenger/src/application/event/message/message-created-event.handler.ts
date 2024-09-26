import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { MessageCreatedEvent } from 'apps/messenger/src/domain/event/message/message-created.event';



@Injectable()
@EventsHandler(MessageCreatedEvent)
export class MessageCreatedEventHandler implements IEventHandler<MessageCreatedEvent> {
  constructor(

) {}

  async handle(message: MessageCreatedEvent): Promise<void> {
    console.log("new message created", message)
    return;
  }
}

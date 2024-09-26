import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { MessageDeletedEvent } from 'apps/messenger/src/domain/event/message/message-deleted.event';



@Injectable()
@EventsHandler(MessageDeletedEvent)
export class MessageDeletedEventHandler implements IEventHandler<MessageDeletedEvent> {
  constructor(

) {}

  async handle(message: MessageDeletedEvent): Promise<void> {
    console.log("new message deleted not implemeneted", message)
    return;
  }
}

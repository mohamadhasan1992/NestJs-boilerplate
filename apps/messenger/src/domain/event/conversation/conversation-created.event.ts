import { IEvent } from '@nestjs/cqrs';
import { Conversation } from '../../entities/conversation';

export class ConversationCreatedEvent implements IEvent {
  constructor(
    public readonly conversation: Conversation,
) {}

}

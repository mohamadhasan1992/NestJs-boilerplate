import { IEvent } from '@nestjs/cqrs';
import { Message } from '../../entities/message';

export class MessageCreatedEvent implements IEvent {
  constructor(
    public readonly message: Message,
) {}

}

import { IEvent } from '@nestjs/cqrs';
import { Message } from '../../entities/message';

export class MessageDeletedEvent implements IEvent {
  constructor(
    public readonly message: Message,
) {}

}


import { IEvent } from '@nestjs/cqrs';
import { User } from '../../../entities/user';

export class UserSignedUpEvent implements IEvent {
  constructor(
    public readonly user: User,
) {}

}

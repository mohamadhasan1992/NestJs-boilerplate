import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserSignedUpEvent } from '../../../../domain/events/impl/auth/user-signed-up-event';



@Injectable()
@EventsHandler(UserSignedUpEvent)
export class UserSignedUpEventHandler implements IEventHandler<UserSignedUpEvent> {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    console.log("user signed up", event)
    return;
  }
}

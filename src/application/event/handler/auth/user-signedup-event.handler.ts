import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { whatsAppService } from 'src/infrustructure/whatspp/whatsapp.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { randomUUID } from 'crypto';
import { UserSignedUpEvent } from '../../../../domain/events/impl/auth/user-signed-up-event';



@Injectable()
@EventsHandler(UserSignedUpEvent)
export class UserSignedUpEventHandler implements IEventHandler<UserSignedUpEvent> {
  constructor(
    private readonly whatsAppService: whatsAppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  
  ) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    const UUID = randomUUID().slice(0,4);
    await this.cacheManager.set(event.phone_number, UUID, 2 * 60 * 1000)
    return await this.whatsAppService.send(UUID, event.phone_number);
  }
}

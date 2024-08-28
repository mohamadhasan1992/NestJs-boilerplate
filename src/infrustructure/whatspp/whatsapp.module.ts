import { Module } from '@nestjs/common';
import { whatsAppService } from './whatsapp.service';


@Module({
  providers: [whatsAppService],
  exports: [whatsAppService]
})
export class WhatsAppModule {}

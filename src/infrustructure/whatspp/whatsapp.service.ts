import { Injectable } from '@nestjs/common';
import { IWhatsappService } from '../adapters/whatsapp.interface';


@Injectable()
export class whatsAppService implements IWhatsappService {

  async send(message: string, phone_number: string): Promise<any> {
    console.log("sending message to", phone_number)
    console.log("message is", message)
  }

}

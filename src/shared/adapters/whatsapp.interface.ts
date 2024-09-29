export interface IWhatsappService {
    send(message: string, phone_number: string): Promise<any>;
  }
  
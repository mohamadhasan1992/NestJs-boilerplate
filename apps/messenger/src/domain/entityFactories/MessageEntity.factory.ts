import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { EntityFactory } from "@shared/shared";
import { Message } from "../entities/message";
import { MessageStatusEnum } from "../object-values/MessageStatus.enum";
import { IMessageRepository } from "../adapters/repository.interface";



@Injectable()
export class MessageEntityFactory implements EntityFactory<Message>{
    constructor(
        @Inject("MessageRepository") 
        private readonly messageRepository: IMessageRepository,
    ){}

    async create(conversation: string, sender: string, content: string): Promise<Message> {
        const message = new Message(
            new Types.ObjectId().toHexString(), 
            conversation, 
            sender,
            content,
            MessageStatusEnum.Sent,
            new Date()
        )
        await this.messageRepository.create(message)
        return message
    }
}
import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { EntityFactory } from "@shared/shared";
import { Conversation } from "../entities/conversation";
import { IConversationRepository } from "../adapters/repository.interface";



@Injectable()
export class ConversationEntityFactory implements EntityFactory<Conversation>{
    constructor(
        @Inject("ConversationRepository") 
        private readonly conversationRepository: IConversationRepository,
    ){}

    async create(creator: string, recipient: string, last_message: string): Promise<Conversation> {
        const conversation = new Conversation(
            new Types.ObjectId().toHexString(), 
            creator, 
            recipient,
            last_message,
            new Date()
        )
        await this.conversationRepository.create(conversation)
        return conversation
    }
}
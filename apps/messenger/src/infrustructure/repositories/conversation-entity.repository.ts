import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "@shared/shared";
import { ConversationSchema } from "../schema/conversation.schema";
import { Conversation } from "../../domain/entities/conversation";
import { IConversationSchemaFactory } from "../../domain/adapters/conversation-schemaFactory.iterface";



@Injectable()
export class ConversationEntityRepository extends BaseEntityRepository<ConversationSchema, Conversation>{
    constructor(
        @InjectModel("Conversation")
        conversationModel: Model<ConversationSchema>,
        @Inject("ConversationSchemaFactory")
        conversationSchemaFactory: IConversationSchemaFactory
    ){
        super(conversationModel, conversationSchemaFactory);
    }

}
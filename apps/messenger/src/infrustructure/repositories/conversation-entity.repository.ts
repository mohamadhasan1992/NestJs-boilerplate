import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "@shared/shared";
import { ConversationSchema } from "../schema/conversation.schema";
import { Conversation } from "../../domain/entities/conversation";
import { ConversationSchemaFactory } from "../schema-factory/conversation-schema.factory";



@Injectable()
export class ConversationEntityRepository extends BaseEntityRepository<ConversationSchema, Conversation>{
    constructor(
        @InjectModel("Conversation")
        conversationModel: Model<ConversationSchema>,
        conversationSchemaFactory: ConversationSchemaFactory
    ){
        super(conversationModel, conversationSchemaFactory);
    }

}
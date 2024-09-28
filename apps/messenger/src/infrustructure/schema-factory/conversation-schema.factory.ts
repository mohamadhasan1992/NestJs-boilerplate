import { Injectable } from "@nestjs/common";
import mongoose, { Types } from "mongoose";
import { EntitySchemaFactory } from "@shared/shared";
import { ConversationSchema } from "../schema/conversation.schema";
import { Conversation } from "../../domain/entities/conversation";





@Injectable()
export class ConversationSchemaFactory implements EntitySchemaFactory<ConversationSchema, Conversation>{
    create(conversation: Conversation): ConversationSchema {
        return{
            _id: new Types.ObjectId(conversation.getId()),
            creator: conversation.getCreator(),
            recipient: conversation.getRecipient(),
            last_message: conversation.getLastMessageById() ? conversation.getLastMessageById()  as unknown as mongoose.Types.ObjectId : null,
            last_message_sent_at: conversation.getLastMessageSentAt(),
        }
    }
    createFromSchema(conversation: ConversationSchema): Conversation {
        return new Conversation(
            conversation._id.toHexString(),
            conversation.creator,
            conversation.recipient,
            conversation.last_message as unknown as string,
            conversation.last_message_sent_at,
        )
    }
    
}
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { EntitySchemaFactory } from "@shared/shared";
import { MessageSchema } from "../schema/message.schema";
import { Message } from "../../domain/entities/message";
import { MessageStatusEnum } from "../../domain/object-values/MessageStatus.enum";





@Injectable()
export class MessageSchemaFactory implements EntitySchemaFactory<MessageSchema, Message>{
    create(message: Message): MessageSchema {
        return{
            _id: new Types.ObjectId(message.getId()),
            conversation: message.getConversationById() as unknown as string,
            sender: message.getSender(),
            content: message.getContent(),
            status: message.getDefaultMessageStatus(),
            created_at: new Date()
        }
    }
    createFromSchema(message: MessageSchema): Message {
        return new Message(
            message._id.toHexString(),
            message.conversation as unknown as string,
            message.sender,
            message.content,
            message.status as unknown as MessageStatusEnum,
            new Date()
        )
    }
    
}
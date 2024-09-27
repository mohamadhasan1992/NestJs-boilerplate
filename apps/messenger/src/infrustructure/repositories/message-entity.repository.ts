import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "@shared/shared";
import { Message } from "../../domain/entities/message";
import { MessageSchema } from "../schema/message.schema";
import { IMessageSchemaFactory } from "../../domain/adapters/message-schemaFactory.iterface";



@Injectable()
export class MessageEntityRepository extends BaseEntityRepository<MessageSchema, Message>{
    constructor(
        @InjectModel("Message")
        messageModel: Model<MessageSchema>,
        @Inject("MessageSchemaFactory")
        messageSchemaFactory: IMessageSchemaFactory
    ){
        super(messageModel, messageSchemaFactory);
    }

}
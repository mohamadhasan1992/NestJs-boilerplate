import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseEntityRepository } from "@shared/shared";
import { Message } from "../../domain/entities/message";
import { MessageSchema } from "../schema/message.schema";
import { MessageSchemaFactory } from "../schema-factory/message-schema.factory";



@Injectable()
export class MessageEntityRepository extends BaseEntityRepository<MessageSchema, Message>{
    constructor(
        @InjectModel("Message")
        messageModel: Model<MessageSchema>,
        messageSchemaFactory: MessageSchemaFactory
    ){
        super(messageModel, messageSchemaFactory);
    }

}
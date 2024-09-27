import { MessageSchema } from "../../infrustructure/schema/message.schema";
import { Message } from "../entities/message";


export interface IMessageSchemaFactory{
    create(conversation: Message): MessageSchema,
    createFromSchema(user: MessageSchema): Message
}
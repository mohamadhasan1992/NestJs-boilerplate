import { ConversationSchema } from "../../infrustructure/schema/conversation.schema";
import { Conversation } from "../entities/conversation";


export interface IConversationSchemaFactory{
    create(conversation: Conversation): ConversationSchema,
    createFromSchema(user: ConversationSchema): Conversation
}
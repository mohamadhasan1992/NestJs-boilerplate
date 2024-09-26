import { getConversationQueryHandler } from "./handler/conversation/get-conversation-query.handler";
import { getMessageQueryHandler } from "./handler/message/get-message-query.handler";





export const QueryHandlers = [
    getMessageQueryHandler,
    getConversationQueryHandler,
]
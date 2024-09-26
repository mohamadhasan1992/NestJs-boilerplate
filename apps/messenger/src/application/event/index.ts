import { ConversationCreatedEventHandler } from "./conversation/conversation-created-event.handler";
import { ConversationDeletedEventHandler } from "./conversation/conversation-deleted-event.handler";
import { MessageCreatedEventHandler } from "./message/message-created-event.handler";
import { MessageDeletedEventHandler } from "./message/message-deleted-event.handler";


export const EventHandlers = [
    ConversationCreatedEventHandler,
    MessageCreatedEventHandler,
    ConversationDeletedEventHandler,
    MessageDeletedEventHandler
]
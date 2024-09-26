import { CreateConversationCommandHandler } from "./handler/conversation/create-conversation-command.handler";
import { DeleteConversationCommandHandler } from "./handler/conversation/delete-conversation-command.handler";
import { CreateMessageCommandHandler } from "./handler/message/create-message-command.handler";
import { DeleteMessageCommandHandler } from "./handler/message/delete-message-command.handler";




export const CommandHandlers = [
    CreateConversationCommandHandler,
    CreateMessageCommandHandler,
    DeleteMessageCommandHandler,
    DeleteConversationCommandHandler
]
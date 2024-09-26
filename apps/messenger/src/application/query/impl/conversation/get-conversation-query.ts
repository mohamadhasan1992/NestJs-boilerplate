
import { ConversationSchema } from "apps/messenger/src/infrustructure/schema/conversation.schema";
import { FilterQuery } from "mongoose";

export class GetConversationQuery {
    constructor(
        public readonly user: string,
        public readonly filterQuery: FilterQuery<ConversationSchema>
      ) {}
}
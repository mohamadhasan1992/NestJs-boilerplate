import { MessageSchema } from "apps/messenger/src/infrustructure/schema/message.schema";
import { FilterQuery } from "mongoose";

export class GetMessageQuery {
    constructor(
        public readonly user: string,
        public readonly conversation: string,
        public readonly filterQuery: FilterQuery<MessageSchema>
      ) {}
}
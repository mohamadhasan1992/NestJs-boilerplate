import { AggregateRoot } from "@nestjs/cqrs";
import { MessageStatusEnum } from "../object-values/MessageStatus.enum";
import { Conversation } from "./conversation";
import { MessageCreatedEvent } from "../event/message/message-created.event";
import { MessageDeletedEvent } from "../event/message/message-deleted.event";



export class Message extends AggregateRoot{
    constructor(
      private readonly _id: string,
      private conversation: string | Conversation,
      private sender: string,
      private content: string,
      private status: MessageStatusEnum,
      private created_at: Date
    ) {
      super()
    }

    getId(){
      return this._id
    }

    getConversationById(): string {
      if (typeof this.conversation === 'string') {
        return this.conversation;
      }
      return this.conversation.getId();
    }

    getConversationPopulated(): Conversation | null {
      if (typeof this.conversation === 'object') {
        return this.conversation;
      }
      return null;
    }

    getSender(): string{
      return this.sender;
    }

    getContent(): string{
        return this.content;
    }
    
    getStatus(): MessageStatusEnum{
      return this.status;
    }

    getDefaultMessageStatus(): MessageStatusEnum{
      return MessageStatusEnum.Sent
    }
    
    getCreatedAt(): Date{
      return this.created_at;
    }

    newMessageCreated(){
      this.apply(new MessageCreatedEvent(this));
    }

    messageDeleted(){
      this.apply(new MessageDeletedEvent(this));
    }

}
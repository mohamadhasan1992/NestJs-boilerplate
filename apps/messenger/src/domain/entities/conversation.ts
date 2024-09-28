import { AggregateRoot } from "@nestjs/cqrs";
import { Message } from "./message";
import { ConversationCreatedEvent } from "../event/conversation/conversation-created.event";
import { ConversationDeletedEvent } from "../event/conversation/conversation-deleted.event";


export class Conversation extends AggregateRoot{
    constructor(
      private readonly _id: string,
      private creator: string,
      private recipient: string,
      private last_message: string | Message | null,
      private last_message_sent_at: Date,
    ) {
      super()
    }

    getId(){
      return this._id
    }

    getCreator(): string{
      return this.creator;
    }

    getRecipient(): string{
      return this.recipient;
    }

    getLastMessageById() {
      return this.last_message;
    }

    getLastMessagePopulated(): Message | null {
      if (typeof this.last_message === 'object') {
        return this.last_message;
      }
      return null;
    }

    getLastMessageSentAt(): Date{
      return this.last_message_sent_at;
    }

    addLastMessageToConversation(lastMessageId: string){
      this.last_message = lastMessageId
      this.last_message_sent_at = new Date()
    }

    newConversationCreated(){
      this.apply(new ConversationCreatedEvent(this));
    }

    conversationDeleted(){
      this.apply(new ConversationDeletedEvent(this))
    }

    
}
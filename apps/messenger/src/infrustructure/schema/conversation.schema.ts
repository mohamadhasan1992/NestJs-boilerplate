import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '@shared/shared';
import mongoose from 'mongoose';


@Schema({versionKey: false, collection: "Conversation", timestamps: true})
export class ConversationSchema extends IdentifiableEntitySchema {
  @Prop({type: String})
  creator: string;

  @Prop({type: String})
  recipient: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Message'})
  last_message?: mongoose.Types.ObjectId;

  @Prop()
  last_message_sent_at?: Date;
}



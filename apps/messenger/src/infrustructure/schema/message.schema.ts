import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '@shared/shared';
import mongoose from 'mongoose';
import { MessageStatusEnum } from '../../domain/object-values/MessageStatus.enum';


@Schema({versionKey: false, collection: "Message", timestamps: true})
export class MessageSchema extends IdentifiableEntitySchema {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Conversation"})
  conversation: mongoose.Types.ObjectId;

  @Prop({type: String})
  sender: string;

  @Prop()
  content: string;

  @Prop({type: String, enum: MessageStatusEnum, default: MessageStatusEnum.Sent})
  status?: string;

  @Prop({type: Date, default: new Date()})
  created_at: Date;
}



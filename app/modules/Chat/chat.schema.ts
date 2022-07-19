import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: false })
  chatName?: string;
  @Prop({ required: false, default: false })
  isGroupChat: boolean;
  @Prop({ required: false })
  users: string[];
  @Prop({ required: false })
  latestMessageId: string;
  @Prop({ required: false })
  groupAdminId: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

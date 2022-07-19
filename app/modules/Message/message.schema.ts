import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: false })
  senderId?: string;
  @Prop({ required: false })
  content?: string;
  @Prop({ required: false })
  chatId?: string;
  @Prop({ required: false })
  readById?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

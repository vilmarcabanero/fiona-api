import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: false })
  commentId?: string;
  @Prop({ required: true })
  message: string;
  @Prop({ required: true })
  userName: string;
  @Prop({ required: false })
  likers?: string[];
  @Prop({ required: false, default: false })
  hidden: boolean;
  @Prop({ required: true })
  username: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentPayload } from './comment.payload';
import { Comment, CommentDocument } from './comment.schema';
import axios from 'axios';
@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private comment: Model<CommentDocument>,
  ) {}

  async getAllComments(): Promise<Comment[]> {
    const comments = await this.comment.find();
    return comments;
  }

  async getComments(postId: string): Promise<Comment[]> {
    const comments = await this.comment.find({ postId });
    return comments;
  }

  async createComment(user: any, payload: CommentPayload): Promise<Comment> {
    const userName = `${user.firstName} ${user.lastName}`;
    const userId = user._id;
    const username = user.username;
    const comment = new this.comment({
      ...payload,
      userName,
      userId,
      username,
    });
    return comment.save();
  }

  async updateComment(_id: string, payload: CommentPayload): Promise<any> {
    const updates = {
      default: payload.message,
    };

    await this.comment.findByIdAndUpdate(_id, updates);
    return {
      message: `Comment with id of ${_id} has been updated.`,
    };
  }

  async deleteComment(_id: string): Promise<any> {
    return this.comment.findByIdAndDelete(_id);
  }

  async deleteAllComments(): Promise<any> {
    return this.comment.deleteMany({});
  }
}

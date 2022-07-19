import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessagePayload } from './message.payload';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private message: Model<MessageDocument>,
  ) {}

  async getMessages(userId: string): Promise<Message[]> {
    const messages = await this.message.find({ userId });
    return messages;
  }

  async getMessage(_id: string): Promise<Message> {
    const message = await this.message.findById(_id);
    return message;
  }

  async createMessage(
    userId: string,
    payload: MessagePayload,
  ): Promise<Message> {
    const message = new this.message({ ...payload, userId });
    return message.save();
  }

  async updateMessage(_id: string, payload: MessagePayload): Promise<any> {
    const updates = {
      default: payload.default,
    };

    await this.message.findByIdAndUpdate(_id, updates);
    return {
      message: `Message with id of ${_id} has been updated.`,
    };
  }

  async deleteMessage(_id: string): Promise<any> {
    return this.message.findByIdAndDelete(_id);
  }
}

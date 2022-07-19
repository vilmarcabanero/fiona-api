import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatPayload } from './chat.payload';
import { Chat, ChatDocument } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chat: Model<ChatDocument>) {}

  async getChats(userId: string): Promise<Chat[]> {
    const chats = await this.chat.find({ userId });
    return chats;
  }

  async getChat(_id: string): Promise<Chat> {
    const chat = await this.chat.findById(_id);
    return chat;
  }

  async createChat(userId: string, payload: ChatPayload): Promise<Chat> {
    const chat = new this.chat({ ...payload, userId });
    return chat.save();
  }

  async deleteChat(_id: string): Promise<any> {
    return this.chat.findByIdAndDelete(_id);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../Auth';
import { ChatPayload } from './chat.payload';
import { Chat, ChatDocument } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chat: Model<ChatDocument>,
    @InjectModel(User.name) private user: Model<UserDocument>,
  ) {}

  async fetchChats(user: any): Promise<Chat[]> {
    const filter = {
      users: {
        $elemMatch: {
          $eq: user._id,
        },
      },
    };
    const chats = await this.chat.find(filter).sort({ updatedAt: -1 });
    return chats;
  }

  async accessChat(user: any, payload: ChatPayload): Promise<Chat> {
    if (!payload.userId) {
      console.log('UserId param not sent with request');
      throw new BadRequestException('userId payload not sent with request.');
    }

    const isChat: any = await this.chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: user._id } } },
        { users: { $elemMatch: { $eq: payload.userId } } },
      ],
    });

    if (isChat.length > 0) {
      return isChat[0];
    } else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [user._id, payload.userId],
      };

      return await this.chat.create(chatData);
    }
  }

  async createGroupChat(user: any, payload: any): Promise<Chat> {
    if (!payload.users.length || !payload.chatName) {
      throw new BadRequestException('Please fill all the fields.');
    }

    let users = payload.users;

    if (payload.users.length < 1) {
      throw new BadRequestException(
        "Users can't be less than 2 to create a group.",
      );
    }

    users = [...users, user._id];

    const data = {
      chatName: payload.chatName,
      users,
      isGroupChat: true,
      groupAdminId: user._id,
    };

    return this.chat.create(data);
  }

  async renameGroup(payload: any): Promise<Chat> {
    const updates = {
      chatName: payload.chatName,
    };
    return this.chat.findByIdAndUpdate(payload.chatId, updates, { new: true });
  }

  async removeFromGroup(payload: any): Promise<Chat> {
    const updates = { $pull: { users: payload.userId } };

    return this.chat.findByIdAndUpdate(payload.chatId, updates, { new: true });
  }

  async addToGroup(payload: any): Promise<Chat> {
    const updates = { $push: { users: payload.userId } };

    return this.chat.findByIdAndUpdate(payload.chatId, updates, { new: true });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'app/decorators/get.user.decorator';
import { ChatService, Chat, ChatPayload } from '.';

@UseGuards(AuthGuard())
@Controller('/api/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(@GetUser() user: any): Promise<Chat[]> {
    return this.chatService.getChats(user._id);
  }

  @Get('/:id')
  async getChat(@Param('id') _id: string): Promise<Chat> {
    return this.chatService.getChat(_id);
  }

  @Post()
  async createChat(
    @Body() payload: ChatPayload,
    @GetUser() user: any,
  ): Promise<Chat> {
    return this.chatService.createChat(user._id, payload);
  }

  @Delete('/:id')
  async deleteChat(@Param('id') _id: string): Promise<Chat> {
    return this.chatService.deleteChat(_id);
  }
}

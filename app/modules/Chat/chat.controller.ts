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
  async fetchChats(@GetUser() user: any): Promise<Chat[]> {
    return this.chatService.fetchChats(user._id);
  }

  @Post()
  async accessChat(
    @Body() payload: ChatPayload,
    @GetUser() user: any,
  ): Promise<Chat> {
    return this.chatService.accessChat(user, payload);
  }

  @Post('/group/create')
  async createGroupChat(
    @Body() payload: ChatPayload,
    @GetUser() user: any,
  ): Promise<Chat> {
    return this.chatService.createGroupChat(user, payload);
  }

  @Patch('/group/rename')
  async renameGroup(@Body() payload: ChatPayload): Promise<Chat> {
    return this.chatService.renameGroup(payload);
  }

  @Patch('/group/remove')
  async removeFromGroup(@Body() payload: ChatPayload): Promise<Chat> {
    return this.chatService.removeFromGroup(payload);
  }

  @Patch('/group/add')
  async addToGroup(@Body() payload: ChatPayload): Promise<Chat> {
    return this.chatService.addToGroup(payload);
  }
}

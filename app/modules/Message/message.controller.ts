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
import { MessageService, Message, MessagePayload } from '.';

@UseGuards(AuthGuard())
@Controller('/api/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessages(@GetUser() user: any): Promise<Message[]> {
    return this.messageService.getMessages(user._id);
  }

  @Get('/:id')
  async getMessage(@Param('id') _id: string): Promise<Message> {
    return this.messageService.getMessage(_id);
  }

  @Post()
  async createMessage(
    @Body() payload: MessagePayload,
    @GetUser() user: any,
  ): Promise<Message> {
    return this.messageService.createMessage(user._id, payload);
  }

  @Patch('/:id')
  async updateMessage(
    @Param('id') _id: string,
    @Body() payload: MessagePayload,
  ): Promise<any> {
    return this.messageService.updateMessage(_id, payload);
  }

  @Delete('/:id')
  async deleteMessage(@Param('id') _id: string): Promise<Message> {
    return this.messageService.deleteMessage(_id);
  }
}

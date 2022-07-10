import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'app/decorators/get.user.decorator';
import { CommentService, Comment, CommentPayload } from '.';

@Controller('/api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return this.commentService.getAllComments();
  }

  @Get('/:postId')
  async getComments(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentService.getComments(postId);
  }

  // @Get('/:id')
  // async getComment(@Param('id') _id: string): Promise<Comment> {
  //   return this.commentService.getComment(_id);
  // }

  @Post()
  async createComment(
    @Body() payload: CommentPayload,
    @GetUser() user: any,
  ): Promise<Comment> {
    return this.commentService.createComment(user, payload);
  }

  @Patch('/:id')
  async updateComment(
    @Param('id') _id: string,
    @Body() payload: CommentPayload,
  ): Promise<any> {
    return this.commentService.updateComment(_id, payload);
  }

  @Delete('/all')
  async deleteAllComments(): Promise<any> {
    return this.commentService.deleteAllComments();
  }

  @Delete('/:id')
  async deleteComment(@Param('id') _id: string): Promise<Comment> {
    return this.commentService.deleteComment(_id);
  }
}

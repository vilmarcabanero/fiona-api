import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as PostMethod,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'app/decorators/get.user.decorator';
import { PostService, Post, PostPayload } from '.';

@Controller('/api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(): Promise<Post[]> {
    return this.postService.getAllPosts();
  }

  @Get('/:id')
  async getPost(@Param('id') _id: string): Promise<Post> {
    return this.postService.getPost(_id);
  }

  @UseGuards(AuthGuard())
  @PostMethod()
  async createPost(
    @Body() payload: PostPayload,
    @GetUser() user: any,
  ): Promise<Post> {
    return this.postService.createPost(user, payload);
  }

  @UseGuards(AuthGuard())
  @Patch('/like/:id')
  async likePost(@Param('id') _id: string, @GetUser() user: any): Promise<any> {
    return this.postService.likePost(_id, user);
  }

  @Patch('/hide/:id')
  async hidePost(@Param('id') _id: string): Promise<Post> {
    return this.postService.hidePost(_id);
  }

  @Patch('/unhide/:id')
  async unhidePost(@Param('id') _id: string): Promise<Post> {
    return this.postService.hidePost(_id);
  }

  @Patch('/:id')
  async updatePost(
    @Param('id') _id: string,
    @Body() payload: PostPayload,
  ): Promise<any> {
    return this.postService.updatePost(_id, payload);
  }

  @Delete('/all')
  async deleteAllPosts(): Promise<any> {
    return this.postService.deleteAllPosts();
  }

  @Delete('/:id')
  async deletePost(@Param('id') _id: string): Promise<Post> {
    return this.postService.deletePost(_id);
  }
}

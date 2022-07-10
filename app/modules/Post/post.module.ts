import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostController, PostSchema, PostService } from '.';
import { AuthModule, User } from '../Auth';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AuthModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

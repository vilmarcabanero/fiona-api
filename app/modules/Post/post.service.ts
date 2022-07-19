import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostPayload } from './post.payload';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private post: Model<PostDocument>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.post.find();
    return posts;
  }

  async getPost(_id: string): Promise<Post> {
    const post = await this.post.findById(_id);
    return post;
  }

  async createPost(user: any, payload: PostPayload): Promise<Post> {
    const userName = `${user.firstName} ${user.lastName}`;
    const userId = user._id;
    const username = user.username;
    const post = new this.post({ ...payload, userId, userName, username });
    return post.save();
  }

  async updatePost(_id: string, payload: PostPayload): Promise<any> {
    const updates = {
      message: payload.message,
    };

    return await this.post.findByIdAndUpdate(_id, updates);
  }

  async likePost(_id: string, user: any): Promise<Post> {
    const found = await this.post.findById(_id);

    const foundLiker = found?.likers.find(
      (liker: any) => liker.toString() === user._id.toString(),
    );

    const likers = found.likers;

    if (!foundLiker) {
      likers.push(user._id);
    } else {
      const indexOfLiker = found.likers
        .map((liker) => {
          return liker.toString();
        })
        .indexOf(user._id.toString());
      likers.splice(indexOfLiker, 1);
    }
    return await this.post.findByIdAndUpdate(_id, {
      likers,
    });
  }

  async deletePost(_id: string): Promise<any> {
    return this.post.findByIdAndDelete(_id);
  }

  async deleteAllPosts(): Promise<any> {
    return this.post.deleteMany({});
  }

  async hidePost(_id: string): Promise<any> {
    return await this.post.findByIdAndUpdate(_id, { hidden: true });
  }

  async unhidePost(_id: string): Promise<any> {
    return await this.post.findByIdAndUpdate(_id, { hidden: false });
  }
}

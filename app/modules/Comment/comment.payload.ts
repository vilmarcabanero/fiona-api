import { IsNotEmpty } from 'class-validator';

export class CommentPayload {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  postId: string;
}

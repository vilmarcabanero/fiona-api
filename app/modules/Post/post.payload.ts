import { IsNotEmpty } from 'class-validator';

export class PostPayload {
  @IsNotEmpty()
  message: string;
}

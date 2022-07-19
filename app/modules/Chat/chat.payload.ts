import { IsNotEmpty } from 'class-validator';

export class ChatPayload {
  @IsNotEmpty()
  userId: string;
}

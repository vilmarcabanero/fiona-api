import { IsNotEmpty } from 'class-validator';

export class MessagePayload {
  @IsNotEmpty()
  default: string;
}

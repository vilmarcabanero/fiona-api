import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageController, MessageSchema, MessageService } from '.';
import { AuthModule } from '../Auth';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    UserModule,
    MessageModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  providers: [ChatGateway],
})
export class ChatModule {} 
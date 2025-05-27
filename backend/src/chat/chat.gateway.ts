import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MessageService, MessageWithUser } from '../message/message.service';

interface ConnectedUser {
  id: string;
  username: string;
  color: string;
  socketId: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, ConnectedUser> = new Map();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      
      if (!user) {
        client.disconnect();
        return;
      }

      const connectedUser: ConnectedUser = {
        id: user.id,
        username: user.username,
        color: user.color,
        socketId: client.id,
      };

      this.connectedUsers.set(client.id, connectedUser);

      const recentMessages = await this.messageService.findRecent(50);
      const formattedMessages = recentMessages.reverse().map(this.formatMessage);
      client.emit('recentMessages', formattedMessages);

      this.server.emit('userConnected', {
        user: {
          id: user.id,
          username: user.username,
          color: user.color,
        },
        connectedUsers: Array.from(this.connectedUsers.values()).map(u => ({
          id: u.id,
          username: u.username,
          color: u.color,
        })),
      });

      console.log(`User ${user.username} connected`);
    } catch (error) {
      console.log('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      this.connectedUsers.delete(client.id);
      
      this.server.emit('userDisconnected', {
        user: {
          id: user.id,
          username: user.username,
          color: user.color,
        },
        connectedUsers: Array.from(this.connectedUsers.values()).map(u => ({
          id: u.id,
          username: u.username,
          color: u.color,
        })),
      });

      console.log(`User ${user.username} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      return;
    }

    try {
      const savedMessage = await this.messageService.create(user.id, data.message);
      const formattedMessage = this.formatMessage(savedMessage);

      this.server.emit('newMessage', formattedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      client.emit('messageError', { error: 'Failed to send message' });
    }
  }

  @SubscribeMessage('getConnectedUsers')
  handleGetConnectedUsers(@ConnectedSocket() client: Socket) {
    const connectedUsers = Array.from(this.connectedUsers.values()).map(u => ({
      id: u.id,
      username: u.username,
      color: u.color,
    }));

    client.emit('connectedUsers', connectedUsers);
  }

  @SubscribeMessage('getRecentMessages')
  async handleGetRecentMessages(@ConnectedSocket() client: Socket) {
    try {
      const recentMessages = await this.messageService.findRecent(50);
      const formattedMessages = recentMessages.reverse().map(this.formatMessage);
      client.emit('recentMessages', formattedMessages);
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      client.emit('messageError', { error: 'Failed to fetch messages' });
    }
  }

  private formatMessage(message: MessageWithUser) {
    return {
      id: message.id,
      message: message.content,
      user: {
        id: message.user.id,
        username: message.user.username,
        color: message.user.color,
      },
      timestamp: message.createdAt,
    };
  }
} 
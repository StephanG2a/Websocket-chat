import { Injectable } from '@nestjs/common';
import { Message, User } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

export type MessageWithUser = Message & {
  user: User;
};

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, content: string): Promise<MessageWithUser> {
    return this.prisma.message.create({
      data: {
        content,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findRecent(limit: number = 50): Promise<MessageWithUser[]> {
    return this.prisma.message.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
  }

  async deleteOldMessages(daysOld: number = 7): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.prisma.message.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
  }
} 
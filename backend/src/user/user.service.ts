import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userData: {
    username: string;
    email: string;
    password: string;
    color?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        color: userData.color || '#3B82F6',
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateProfile(id: string, updateData: { color?: string }): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      return null;
    }
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
} 
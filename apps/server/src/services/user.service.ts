import { prisma } from '../lib/prisma';
import type { User } from '@prisma/client';

export interface CreateUserDto {
  email: string;
  name?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
}

export class UserService {
  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: string): Promise<User | null> {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      return null;
    }
  }
}
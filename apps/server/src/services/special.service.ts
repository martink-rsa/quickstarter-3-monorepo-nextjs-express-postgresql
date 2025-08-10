import type { Special } from '@prisma/client';

import { prisma } from '../lib/prisma';

export interface CreateSpecialDto {
  title: string;
  description?: string;
  price: number;
  isActive?: boolean;
}

export interface UpdateSpecialDto {
  title?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

export class SpecialService {
  async getAllSpecials(): Promise<Special[]> {
    return await prisma.special.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveSpecials(): Promise<Special[]> {
    return await prisma.special.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSpecialById(id: string): Promise<Special | null> {
    return await prisma.special.findUnique({
      where: { id },
    });
  }

  async createSpecial(data: CreateSpecialDto): Promise<Special> {
    return await prisma.special.create({
      data,
    });
  }

  async updateSpecial(id: string, data: UpdateSpecialDto): Promise<Special | null> {
    try {
      return await prisma.special.update({
        where: { id },
        data,
      });
    } catch (error) {
      return null;
    }
  }

  async deleteSpecial(id: string): Promise<Special | null> {
    try {
      return await prisma.special.delete({
        where: { id },
      });
    } catch (error) {
      return null;
    }
  }
}

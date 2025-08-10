import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockSpecial } from '../test/helpers';
import '../test/mocks/prisma';
import { prismaMock } from '../test/mocks/prisma';

import { SpecialService } from './special.service';

describe('SpecialService', () => {
  let specialService: SpecialService;

  beforeEach(() => {
    specialService = new SpecialService();
    vi.clearAllMocks();
  });

  describe('getAllSpecials', () => {
    it('should return all specials ordered by createdAt desc', async () => {
      const mockSpecials = [createMockSpecial(), createMockSpecial(), createMockSpecial()];

      prismaMock.special.findMany.mockResolvedValue(mockSpecials);

      const result = await specialService.getAllSpecials();

      expect(result).toEqual(mockSpecials);
      expect(prismaMock.special.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getActiveSpecials', () => {
    it('should return only active specials', async () => {
      const mockSpecials = [
        createMockSpecial({ isActive: true }),
        createMockSpecial({ isActive: true }),
      ];

      prismaMock.special.findMany.mockResolvedValue(mockSpecials);

      const result = await specialService.getActiveSpecials();

      expect(result).toEqual(mockSpecials);
      expect(prismaMock.special.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getSpecialById', () => {
    it('should return a special by id', async () => {
      const mockSpecial = createMockSpecial();
      prismaMock.special.findUnique.mockResolvedValue(mockSpecial);

      const result = await specialService.getSpecialById(mockSpecial.id);

      expect(result).toEqual(mockSpecial);
      expect(prismaMock.special.findUnique).toHaveBeenCalledWith({
        where: { id: mockSpecial.id },
      });
    });

    it('should return null if special not found', async () => {
      prismaMock.special.findUnique.mockResolvedValue(null);

      const result = await specialService.getSpecialById('non-existent-id');

      expect(result).toBeNull();
      expect(prismaMock.special.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });
  });

  describe('createSpecial', () => {
    it('should create a new special', async () => {
      const specialData = {
        title: 'Test Special',
        description: 'Test Description',
        price: 99.99,
        isActive: true,
      };
      const mockSpecial = createMockSpecial(specialData);
      prismaMock.special.create.mockResolvedValue(mockSpecial);

      const result = await specialService.createSpecial(specialData);

      expect(result).toEqual(mockSpecial);
      expect(prismaMock.special.create).toHaveBeenCalledWith({
        data: specialData,
      });
    });

    it('should create a special without optional fields', async () => {
      const specialData = {
        title: 'Test Special',
        price: 49.99,
      };
      const mockSpecial = createMockSpecial(specialData);
      prismaMock.special.create.mockResolvedValue(mockSpecial);

      const result = await specialService.createSpecial(specialData);

      expect(result).toEqual(mockSpecial);
      expect(prismaMock.special.create).toHaveBeenCalledWith({
        data: specialData,
      });
    });
  });

  describe('updateSpecial', () => {
    it('should update a special', async () => {
      const updateData = {
        title: 'Updated Special',
        price: 149.99,
        isActive: false,
      };
      const mockSpecial = createMockSpecial(updateData);
      prismaMock.special.update.mockResolvedValue(mockSpecial);

      const result = await specialService.updateSpecial(mockSpecial.id, updateData);

      expect(result).toEqual(mockSpecial);
      expect(prismaMock.special.update).toHaveBeenCalledWith({
        where: { id: mockSpecial.id },
        data: updateData,
      });
    });

    it('should return null if special not found', async () => {
      prismaMock.special.update.mockRejectedValue(new Error('Special not found'));

      const result = await specialService.updateSpecial('non-existent-id', {
        title: 'Test',
      });

      expect(result).toBeNull();
    });

    it('should update only price', async () => {
      const updateData = { price: 29.99 };
      const mockSpecial = createMockSpecial(updateData);
      prismaMock.special.update.mockResolvedValue(mockSpecial);

      const result = await specialService.updateSpecial(mockSpecial.id, updateData);

      expect(result).toEqual(mockSpecial);
      expect(prismaMock.special.update).toHaveBeenCalledWith({
        where: { id: mockSpecial.id },
        data: updateData,
      });
    });
  });

  describe('deleteSpecial', () => {
    it('should delete a special', async () => {
      const mockSpecial = createMockSpecial();
      prismaMock.special.delete.mockResolvedValue(mockSpecial);

      const result = await specialService.deleteSpecial(mockSpecial.id);

      expect(result).toEqual(mockSpecial);
      expect(prismaMock.special.delete).toHaveBeenCalledWith({
        where: { id: mockSpecial.id },
      });
    });

    it('should return null if special not found', async () => {
      prismaMock.special.delete.mockRejectedValue(new Error('Special not found'));

      const result = await specialService.deleteSpecial('non-existent-id');

      expect(result).toBeNull();
    });
  });
});

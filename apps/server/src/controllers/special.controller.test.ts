import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SpecialService } from '../services/special.service';
import { createMockSpecial } from '../test/helpers';

import { SpecialController } from './special.controller';

describe('SpecialController', () => {
  let specialController: SpecialController;
  let mockSpecialService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockSpecialService = {
      getAllSpecials: vi.fn(),
      getActiveSpecials: vi.fn(),
      getSpecialById: vi.fn(),
      createSpecial: vi.fn(),
      updateSpecial: vi.fn(),
      deleteSpecial: vi.fn(),
    };

    specialController = new SpecialController(mockSpecialService);

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  describe('getAllSpecials', () => {
    it('should return all specials', async () => {
      const mockSpecials = [createMockSpecial(), createMockSpecial()];
      mockSpecialService.getAllSpecials.mockResolvedValue(mockSpecials);

      await specialController.getAllSpecials(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.getAllSpecials).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpecials);
    });

    it('should handle errors', async () => {
      mockSpecialService.getAllSpecials.mockRejectedValue(new Error('Database error'));

      await specialController.getAllSpecials(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch specials',
      });
    });
  });

  describe('getActiveSpecials', () => {
    it('should return only active specials', async () => {
      const mockSpecials = [
        createMockSpecial({ isActive: true }),
        createMockSpecial({ isActive: true }),
      ];
      mockSpecialService.getActiveSpecials.mockResolvedValue(mockSpecials);

      await specialController.getActiveSpecials(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.getActiveSpecials).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpecials);
    });

    it('should handle errors', async () => {
      mockSpecialService.getActiveSpecials.mockRejectedValue(new Error('Database error'));

      await specialController.getActiveSpecials(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch active specials',
      });
    });
  });

  describe('getSpecialById', () => {
    it('should return a special by id', async () => {
      const mockSpecial = createMockSpecial();
      mockRequest.params = { id: mockSpecial.id };
      mockSpecialService.getSpecialById.mockResolvedValue(mockSpecial);

      await specialController.getSpecialById(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.getSpecialById).toHaveBeenCalledWith(mockSpecial.id);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpecial);
    });

    it('should return 404 if special not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockSpecialService.getSpecialById.mockResolvedValue(null);

      await specialController.getSpecialById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Special not found',
      });
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockSpecialService.getSpecialById.mockRejectedValue(new Error('Database error'));

      await specialController.getSpecialById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch special',
      });
    });
  });

  describe('createSpecial', () => {
    it('should create a new special', async () => {
      const specialData = {
        title: 'Test Special',
        description: 'Test Description',
        price: '99.99',
        isActive: true,
      };
      const mockSpecial = createMockSpecial({
        ...specialData,
        price: 99.99,
      });
      mockRequest.body = specialData;
      mockSpecialService.createSpecial.mockResolvedValue(mockSpecial);

      await specialController.createSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.createSpecial).toHaveBeenCalledWith({
        title: specialData.title,
        description: specialData.description,
        price: 99.99,
        isActive: specialData.isActive,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpecial);
    });

    it('should return 400 if title is missing', async () => {
      mockRequest.body = { price: '99.99' };

      await specialController.createSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.createSpecial).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Title and price are required',
      });
    });

    it('should return 400 if price is missing', async () => {
      mockRequest.body = { title: 'Test Special' };

      await specialController.createSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.createSpecial).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Title and price are required',
      });
    });

    it('should handle errors', async () => {
      mockRequest.body = { title: 'Test', price: '99.99' };
      mockSpecialService.createSpecial.mockRejectedValue(new Error('Database error'));

      await specialController.createSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create special',
      });
    });
  });

  describe('updateSpecial', () => {
    it('should update a special', async () => {
      const updateData = {
        title: 'Updated Special',
        price: '149.99',
        isActive: false,
      };
      const mockSpecial = createMockSpecial({
        ...updateData,
        price: 149.99,
      });
      mockRequest.params = { id: mockSpecial.id };
      mockRequest.body = updateData;
      mockSpecialService.updateSpecial.mockResolvedValue(mockSpecial);

      await specialController.updateSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.updateSpecial).toHaveBeenCalledWith(mockSpecial.id, {
        title: updateData.title,
        price: 149.99,
        isActive: updateData.isActive,
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpecial);
    });

    it('should handle partial updates', async () => {
      const updateData = { price: '29.99' };
      const mockSpecial = createMockSpecial({ price: 29.99 });
      mockRequest.params = { id: mockSpecial.id };
      mockRequest.body = updateData;
      mockSpecialService.updateSpecial.mockResolvedValue(mockSpecial);

      await specialController.updateSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.updateSpecial).toHaveBeenCalledWith(mockSpecial.id, {
        price: 29.99,
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpecial);
    });

    it('should return 404 if special not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockRequest.body = { title: 'Test' };
      mockSpecialService.updateSpecial.mockResolvedValue(null);

      await specialController.updateSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Special not found',
      });
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockRequest.body = { title: 'Test' };
      mockSpecialService.updateSpecial.mockRejectedValue(new Error('Database error'));

      await specialController.updateSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update special',
      });
    });
  });

  describe('deleteSpecial', () => {
    it('should delete a special', async () => {
      const mockSpecial = createMockSpecial();
      mockRequest.params = { id: mockSpecial.id };
      mockSpecialService.deleteSpecial.mockResolvedValue(mockSpecial);

      await specialController.deleteSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockSpecialService.deleteSpecial).toHaveBeenCalledWith(mockSpecial.id);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Special deleted successfully',
      });
    });

    it('should return 404 if special not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockSpecialService.deleteSpecial.mockResolvedValue(null);

      await specialController.deleteSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Special not found',
      });
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockSpecialService.deleteSpecial.mockRejectedValue(new Error('Database error'));

      await specialController.deleteSpecial(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete special',
      });
    });
  });
});

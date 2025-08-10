import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserService } from '../services/user.service';
import { createMockUser } from '../test/helpers';

import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUserService = {
      getAllUsers: vi.fn(),
      getUserById: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
    };

    userController = new UserController(mockUserService);

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

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [createMockUser(), createMockUser()];
      mockUserService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
      mockUserService.getAllUsers.mockRejectedValue(new Error('Database error'));

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch users',
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = createMockUser();
      mockRequest.params = { id: mockUser.id };
      mockUserService.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockUserService.getUserById.mockResolvedValue(null);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockUserService.getUserById.mockRejectedValue(new Error('Database error'));

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch user',
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', name: 'Test User' };
      const mockUser = createMockUser(userData);
      mockRequest.body = userData;
      mockUserService.createUser.mockResolvedValue(mockUser);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 if email is missing', async () => {
      mockRequest.body = { name: 'Test User' };

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.createUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required',
      });
    });

    it('should handle errors', async () => {
      mockRequest.body = { email: 'test@example.com' };
      mockUserService.createUser.mockRejectedValue(new Error('Database error'));

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create user',
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateData = { email: 'updated@example.com', name: 'Updated User' };
      const mockUser = createMockUser(updateData);
      mockRequest.params = { id: mockUser.id };
      mockRequest.body = updateData;
      mockUserService.updateUser.mockResolvedValue(mockUser);

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(mockUser.id, updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockRequest.body = { email: 'test@example.com' };
      mockUserService.updateUser.mockResolvedValue(null);

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockRequest.body = { email: 'test@example.com' };
      mockUserService.updateUser.mockRejectedValue(new Error('Database error'));

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update user',
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = createMockUser();
      mockRequest.params = { id: mockUser.id };
      mockUserService.deleteUser.mockResolvedValue(mockUser);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(mockUser.id);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
      });
    });

    it('should return 404 if user not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockUserService.deleteUser.mockResolvedValue(null);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockUserService.deleteUser.mockRejectedValue(new Error('Database error'));

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete user',
      });
    });
  });
});

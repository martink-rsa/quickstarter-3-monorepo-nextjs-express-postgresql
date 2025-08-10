import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockUser } from '../test/helpers';
import '../test/mocks/prisma';
import { prismaMock } from '../test/mocks/prisma';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users ordered by createdAt desc', async () => {
      const mockUsers = [createMockUser(), createMockUser(), createMockUser()];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = createMockUser();
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return null if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await userService.getUserById('non-existent-id');

      expect(result).toBeNull();
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockUser = createMockUser(userData);
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });

    it('should create a user without name', async () => {
      const userData = {
        email: 'test@example.com',
      };
      const mockUser = createMockUser({ ...userData, name: null });
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateData = {
        email: 'updated@example.com',
        name: 'Updated User',
      };
      const mockUser = createMockUser(updateData);
      prismaMock.user.update.mockResolvedValue(mockUser);

      const result = await userService.updateUser(mockUser.id, updateData);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateData,
      });
    });

    it('should return null if user not found', async () => {
      prismaMock.user.update.mockRejectedValue(new Error('User not found'));

      const result = await userService.updateUser('non-existent-id', {
        email: 'test@example.com',
      });

      expect(result).toBeNull();
    });

    it('should update only email', async () => {
      const updateData = { email: 'newemail@example.com' };
      const mockUser = createMockUser(updateData);
      prismaMock.user.update.mockResolvedValue(mockUser);

      const result = await userService.updateUser(mockUser.id, updateData);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateData,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = createMockUser();
      prismaMock.user.delete.mockResolvedValue(mockUser);

      const result = await userService.deleteUser(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return null if user not found', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('User not found'));

      const result = await userService.deleteUser('non-existent-id');

      expect(result).toBeNull();
    });
  });
});

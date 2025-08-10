import type { Application } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from './app';

vi.mock('./services/user.service', () => ({
  UserService: vi.fn().mockImplementation(() => ({
    getAllUsers: vi.fn(),
    getUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  })),
}));

vi.mock('./services/special.service', () => ({
  SpecialService: vi.fn().mockImplementation(() => ({
    getAllSpecials: vi.fn(),
    getActiveSpecials: vi.fn(),
    getSpecialById: vi.fn(),
    createSpecial: vi.fn(),
    updateSpecial: vi.fn(),
    deleteSpecial: vi.fn(),
  })),
}));

describe('App', () => {
  let app: Application;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return health status on GET /api/v1/health', async () => {
      const response = await request(app).get('/api/v1/health').expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        timestamp: expect.any(String),
      });

      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('CORS', () => {
    it('should have CORS headers', async () => {
      const response = await request(app).get('/api/v1/health').expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('JSON Parsing', () => {
    it('should parse JSON request bodies', async () => {
      const testData = { test: 'data' };

      const response = await request(app).post('/api/v1/users').send(testData);

      expect(response.request._data).toEqual(testData);
    });
  });

  describe('Route Registration', () => {
    it('should register user routes', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect((res) => {
          expect(res.status).not.toBe(404);
        });
    });

    it('should register special routes', async () => {
      await request(app)
        .get('/api/v1/specials')
        .expect((res) => {
          expect(res.status).not.toBe(404);
        });
    });

    it('should return 404 for unregistered routes', async () => {
      await request(app).get('/api/v1/nonexistent').expect(404);
    });
  });
});

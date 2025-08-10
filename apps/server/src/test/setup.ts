import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Mock environment variables
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');

beforeAll(() => {
  // Setup code that runs once before all tests
});

afterEach(() => {
  // Cleanup after each test
  vi.clearAllMocks();
});

afterAll(() => {
  // Cleanup code that runs once after all tests
  vi.unstubAllEnvs();
});

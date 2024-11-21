import { User } from '@neo/domain/user';
import { vi } from 'vitest';
import { ILogger } from '../../interfaces';
import { IRefreshTokenRepository } from '../../auth';

export const mockUsers = [
  User.toClass({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatarUrl: 'https://example.com/avatar1.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    loginsCount: 1,
    passwordHash: 'hashedpassword',
    username: 'johndoe',
  }),
  User.toClass({
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    avatarUrl: 'https://example.com/avatar2.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    loginsCount: 1,
    passwordHash: 'hashedpassword',
    username: 'janesmith',
  })
];

export const mockUserRepository = {
  getAll: vi.fn(),
  getByEmail: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn()
};

export const mockTokenRepository: IRefreshTokenRepository = {
  delete: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn()
};

export const mockDb = {
  userRepository: mockUserRepository,
  refreshTokenRepository: mockTokenRepository,
  disconnect: vi.fn()
};

export const mockLogger: ILogger = {
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn()
};

export const mockServices = {
  db: mockDb,
  logger: mockLogger,
};
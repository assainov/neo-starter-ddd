import { IEncryptionService, IUserRepository, User } from '@neo/domain/user';
import { vi } from 'vitest';
import { IDatabase, ILogger } from '../../interfaces';
import { ITokenRepository, ITokenService, RefreshToken } from '@neo/domain/refresh-token';

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

export const mockToken = RefreshToken.toClass({
  id: '123',
  token: 'myMockToken',
  expiresAt: new Date(),
  createdAt: new Date(),
  lastUsedAt: new Date(),
  revokedAt: null,
  userId: '1'
});

export const mockEncryptionService: IEncryptionService = {
  hashPassword: vi.fn(),
  comparePassword: vi.fn()
};

export const mockTokenService: ITokenService = {
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
  accessTokenExpiryMinutes: 2,
  refreshExpiryDays: 1,
  verifyAccessToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
};

export const mockUserRepository: IUserRepository = {
  getAll: vi.fn(),
  getByEmail: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn()
};

export const mockTokenRepository: ITokenRepository = {
  delete: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn()
};

export const mockDb: IDatabase = {
  userRepository: mockUserRepository,
  tokenRepository: mockTokenRepository,
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
  encryptionService: mockEncryptionService,
  tokenService: mockTokenService,
  db: mockDb,
  logger: mockLogger,
};
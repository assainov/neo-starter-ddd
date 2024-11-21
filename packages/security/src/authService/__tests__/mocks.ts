import { vi } from 'vitest';
import { IEncryptionService } from '../services/IEncryptionService';
import { ITokenService } from '../services/ITokenService';

export const mockPassword = {
  password: 'qwerty',
  passwordHash: '$2a$10$Q2DURF3mDYbOJj.8wpJ2veQQ0uVuCBOqCbP1xkXWAI1uAViIr9hMW'
};

export const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://example.com/avatar1.png',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  loginsCount: 1,
  passwordHash: mockPassword.passwordHash,
  username: 'johndoe',
};

export const mockHooks = {
  createUser: vi.fn(),
  updateUser: vi.fn(),
  getUserById: vi.fn(),
  getUserByEmail: vi.fn(),
  createRefreshToken: vi.fn(),
  getRefreshTokenById: vi.fn(),
  updateRefreshToken: vi.fn(),
  deleteRefreshToken: vi.fn(),
};

export const mockLogger = {
  error: vi.fn(),
};

export const mockValidToken = {
  id: '123',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoyOTE5MjM5MDIyLCJpZCI6IjEyMyIsInVzZXJJZCI6IjEifQ.rjw3eCdltkdWsYNgJ3LL6h41ZRQJ00VumABIjCaANgE',
  expiresAt: new Date('2062-07-04'),
  createdAt: new Date(),
  lastUsedAt: new Date(),
  revokedAt: null,
  userId: mockUser.id,
};

export const mockExpiredToken = {
  id: '123',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxMjE2MjM5MDIyLCJleHAiOjEyMTYyMzkwMjJ9.cH1ZAGvMU_InIB180GU7JW2cRJqf9cE9Z4MCbm-jhq4',
  expiresAt: new Date('2008-07-17'),
  createdAt: new Date(),
  lastUsedAt: new Date(),
  revokedAt: null,
  userId: mockUser.id,
};

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

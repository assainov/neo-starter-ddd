import { describe, expect, it } from 'vitest';
import { compareUserDtos } from './utils/compareUserDtos';
import { createAuthService } from '../createAuthService';
import { mockLogger, mockHooks, mockPassword, mockUser } from './mocks';

const { registerWithPassword } = createAuthService({ logger: mockLogger });

describe('AuthService', () => {
  describe('registerWithPassword', () => {
    it('should return new user details on success', async () => {
      mockHooks.getUserByEmail.mockReturnValue(null);
      mockHooks.createUser.mockReturnValue(mockUser);
      const password = mockPassword.password;

      const response = await registerWithPassword({ email: mockUser.email, password }, mockHooks);

      expect(response).toBeDefined();
      compareUserDtos(response, mockUser);
    });

    it('should error out when user already exists', async () => {
      mockHooks.getUserByEmail.mockReturnValue(mockUser);

      await expect(registerWithPassword({ ...mockUser, password: '123456' }, mockHooks )).rejects.toThrow(`User with email ${mockUser.email} already exists`);
    });
  });
});
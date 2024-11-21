import { describe, expect, it } from 'vitest';
import { compareUserDtos } from './utils/compareUserDtos';
import { createAuthService } from '../createAuthService';
import { mockHooks, mockLogger, mockUser } from './mocks';

const { getProfile } = createAuthService({ logger: mockLogger });

describe('AuthService', () => {
  describe('getUserProfile', () => {
    it('should return my details when I send email', async () => {
      // arrange
      mockHooks.getUserById.mockReturnValue(mockUser);

      const user = await getProfile({ userId: mockUser.id }, mockHooks);

      expect(user).toBeDefined();
      compareUserDtos(user, mockUser);
    });
    it('should throw an error when user is not found', async () => {
      // arrange
      mockHooks.getUserById.mockReturnValue(null);

      await expect(getProfile({ userId: mockUser.id }, mockHooks)).rejects.toThrow('Invalid email or password');
    });
  });
});
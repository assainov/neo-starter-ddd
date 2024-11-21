import { describe, expect, it } from 'vitest';
import { createAuthService } from '../createAuthService';
import { mockHooks, mockLogger, mockValidToken } from './mocks';

const { logout } = createAuthService({ logger: mockLogger });

describe('AuthService', () => {
  describe('logout', () => {
    it('should return success on logout', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue(mockValidToken);
      mockHooks.deleteRefreshToken.mockReturnValue(true);

      await expect(logout({ refreshToken: mockValidToken.token }, mockHooks)).resolves.toBeUndefined();
    });

    it('should throw an error on unexisting token', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue(null);

      await expect(logout({ refreshToken: mockValidToken.token }, mockHooks)).rejects.toThrow('Invalid refresh token');
    });
  });
});
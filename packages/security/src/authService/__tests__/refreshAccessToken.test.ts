import { describe, expect, it } from 'vitest';
import { createAuthService } from '../createAuthService';
import { mockHooks, mockExpiredToken, mockLogger, mockUser, mockValidToken } from './mocks';
import { TokenGenerationType } from '../services/ITokenService';
import { testServices } from './testServices';

const { refreshAccessToken } = createAuthService({ logger: mockLogger });

describe('AuthService', () => {
  describe('refreshAccessToken', () => {
    it('should return valid access token', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue(mockValidToken);
      mockHooks.updateRefreshToken.mockReturnValue(true);

      const accessToken = await refreshAccessToken({ refreshToken: mockValidToken.token }, mockHooks);

      expect(accessToken).toBeTruthy();

      const { userId: accessTokenUserId, generatedBy } = testServices.tokenService.verifyAccessToken(accessToken);

      expect(accessTokenUserId).toEqual(mockUser.id);
      expect(generatedBy).toEqual(TokenGenerationType.RefreshToken);
    });

    it('should throw an error on not found token', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue(null);

      await expect(refreshAccessToken({ refreshToken: mockValidToken.token }, mockHooks)).rejects.toThrow('Refresh token not found');
    });

    it('should throw an error on expired token', async () => {
      await expect(refreshAccessToken({ refreshToken: mockExpiredToken.token }, mockHooks)).rejects.toThrow('Invalid token');
    });

    it('should throw an error on revoked token', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue({ ...mockValidToken, revokedAt: new Date('2020-11-02') });
      await expect(refreshAccessToken({ refreshToken: mockValidToken.token }, mockHooks)).rejects.toThrow('Revoked refresh token');
    });
  });
});
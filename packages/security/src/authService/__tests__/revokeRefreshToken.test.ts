import { describe, expect, it } from 'vitest';
import { createAuthService } from '../createAuthService';
import { mockHooks, mockLogger, mockValidToken } from './mocks';

const { revokeRefreshToken } = createAuthService({ logger: mockLogger });

describe('AuthService', () => {
  describe('revokeRefreshToken', () => {
    it('should successfully revoke refresh token', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue(mockValidToken);
      mockHooks.updateRefreshToken.mockReturnValue(true);

      await expect(revokeRefreshToken({ refreshTokenId: mockValidToken.id }, mockHooks)).resolves.toBeUndefined();
    });

    it('should throw an error on not found token', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue(null);

      await expect(revokeRefreshToken({ refreshTokenId: mockValidToken.id }, mockHooks)).rejects.toThrow('Refresh token to revoke was not found');
    });

    it('should throw an error when the token is already revoked', async () => {
      mockHooks.getRefreshTokenById.mockReturnValue({ ...mockValidToken, revokedAt: new Date('2020-11-02') });

      await expect(revokeRefreshToken({ refreshTokenId: mockValidToken.id }, mockHooks)).rejects.toThrow('Refresh token is already revoked');
    });
  });
});
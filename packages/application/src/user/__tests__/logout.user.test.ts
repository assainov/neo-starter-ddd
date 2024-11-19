import { describe, expect, it, vi } from 'vitest';
import { mockServices, mockToken } from './mocks';
import { logoutUserHandler } from '../logout.user.handler';

describe('User', () => {
  describe('Logout', () => {
    it('should return success on logout', async () => {
      const tokenId = '123';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          tokenRepository: { ...mockServices.db.tokenRepository,
            delete: vi.fn(),
            getById: vi.fn().mockReturnValue(mockToken) } },
        tokenService: { ...mockServices.tokenService,
          verifyRefreshToken: vi.fn().mockReturnValue({ id: tokenId }) }
      };

      const response = await logoutUserHandler({ di, refreshToken: mockToken.token });

      expect(response).toBeDefined();
      expect(response.success).toEqual(true);
    });

    it('should throw an error on unexisting token', async () => {
      const tokenId = '123';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          tokenRepository: { ...mockServices.db.tokenRepository,
            getById: vi.fn().mockReturnValue(null) } },
        tokenService: { ...mockServices.tokenService,
          verifyRefreshToken: vi.fn().mockReturnValue({ id: tokenId }) }
      };

      await expect(logoutUserHandler({ di, refreshToken: mockToken.token })).rejects.toThrow('Invalid refresh token');
    });

  });
});
import { describe, expect, it } from 'vitest';
import { mockHooks, mockLogger, mockPassword, mockUser } from './mocks';
import { createAuthService } from '../createAuthService';
import { testServices } from './testServices';
import { TokenGenerationType } from '../services/ITokenService';

const { loginWithPassword } = createAuthService({ logger: mockLogger });

describe('AuthService', () => {
  describe('loginWithPassword', () => {
    it('should return all data on successful login', async () => {
      // arrange
      mockHooks.getUserByEmail.mockReturnValue(mockUser);

      const response = await loginWithPassword({ email: mockUser.email, password: mockPassword.password }, mockHooks);

      expect(response).toBeDefined();
      expect(response.session.accessToken).toBeTruthy();
      expect(response.session.refreshToken).toBeTruthy();
      expect(response.user).toBeTruthy();

      const { id: refreshTokenId, userId: refreshTokenUserId } = testServices.tokenService.verifyRefreshToken(response.session.refreshToken);
      const { userId: accessTokenUserId, generatedBy } = testServices.tokenService.verifyAccessToken(response.session.accessToken);

      expect(refreshTokenUserId).toEqual(mockUser.id);
      expect(refreshTokenId).toBeDefined();
      expect(accessTokenUserId).toEqual(mockUser.id);
      expect(generatedBy).toEqual(TokenGenerationType.UserCredentials);
    });

    it('should throw an error on unexisting error', async () => {
      mockHooks.getUserByEmail.mockReturnValue(undefined);

      await expect(loginWithPassword({ email: 'random', password: 'random' }, mockHooks)).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error on invalid password', async () => {
      mockHooks.getUserByEmail.mockReturnValue(mockUser);
      const wrongPassword = 'wrong-pass';

      await expect(loginWithPassword({ email: mockUser.email, password: wrongPassword }, mockHooks)).rejects.toThrow('Invalid email or password');
    });
  });
});
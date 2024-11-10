import { describe, expect, it, vi } from 'vitest';
import { mockServices, mockUsers } from './mocks';
import { UserDto } from '../common.dto';
import { loginUserHandler } from '../login.user.handler';

describe('User', () => {
  describe('Login', () => {
    it('should return accessToken on successful login', async () => {
      const mockUser = mockUsers.at(0) as UserDto;
      const { email } = mockUser;
      const password = 'password';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getByEmail: vi.fn().mockReturnValue(mockUser) } },
        encryptionService: { ...mockServices.encryptionService,
          comparePassword: vi.fn().mockReturnValue(true) },
        tokenService: { ...mockServices.tokenService,
          generateToken: vi.fn().mockReturnValue('mySuperSecureToken=)') }
      };

      const response = await loginUserHandler({ di, loginDto: { email, password } });

      expect(response).toBeDefined();
      expect(response.accessToken).toEqual('mySuperSecureToken=)');
    });

    it('should throw an error on unexisting error', async () => {
      const email = 'doesnt@exist.com';
      const password = 'password';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getByEmail: vi.fn().mockReturnValue(undefined) } } };

      await expect(loginUserHandler({ di, loginDto: { email, password } })).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error on invalid password', async () => {
      const mockUser = mockUsers.at(0) as UserDto;
      const { email } = mockUser;
      const password = 'password';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getByEmail: vi.fn().mockReturnValue(mockUser) } } };

      await expect(loginUserHandler({ di, loginDto: { email, password } })).rejects.toThrow('Invalid email or password');
    });

  });
});
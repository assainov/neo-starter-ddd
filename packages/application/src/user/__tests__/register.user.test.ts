import { describe, expect, it, vi } from 'vitest';
import { mockServices, mockUsers } from './mocks';
import { UserDto } from '../common.dto';
import { registerUserHandler } from '../register.user.handler';
import { compareUserDtos } from './utils/compareUserDtos';

describe('User', () => {
  describe('Register', () => {
    it('should return new user details on success', async () => {
      const mockUser = mockUsers.at(0)?.toJSON() as UserDto;
      const password = 'password';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            create: vi.fn().mockReturnValue(mockUser),
            getByEmail: vi.fn().mockReturnValue(undefined) },
          encryptionService: { ...mockServices.encryptionService,
            hashPassword: vi.fn().mockReturnValue('supersecure') } }
      };

      const response = await registerUserHandler({ di, newUserDto: { ...mockUser, password } });

      expect(response).toBeDefined();
      compareUserDtos(response, mockUser);
    });

    it('should error out when user already exists', async () => {
      const mockUser = mockUsers.at(0)?.toJSON() as UserDto;

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getByEmail: vi.fn().mockReturnValue(mockUser) } } };

      await expect(registerUserHandler({ di, newUserDto: { ...mockUser, password: '123456' } })).rejects.toThrow(`User with email ${mockUser.email} already exists`);
    });
  });
});
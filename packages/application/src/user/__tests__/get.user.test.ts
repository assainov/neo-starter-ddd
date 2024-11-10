import { describe, expect, it, vi } from 'vitest';
import { mockServices, mockUsers } from './mocks';
import { UserDto } from '../common.dto';
import { getUserHandler } from '../get.user.handler';
import { compareUserDtos } from './utils/compareUserDtos';

describe('User', () => {
  describe('Get', () => {
    it('should return the user', async () => {
      const id = '1';
      const mockUser = mockUsers.find(u => u.id === id) as UserDto;

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getById: vi.fn().mockReturnValue(mockUser) } } };

      const user = await getUserHandler({ di, id });

      expect(user).toBeDefined();
      compareUserDtos(user as UserDto, mockUser);
    });

    it('should throw an error when user is not found', async () => {
      const id = '1';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getById: vi.fn().mockReturnValue(undefined) } } };

      await expect(getUserHandler({ di, id })).rejects.toThrow('User not found');
    });

  });
});
import { describe, expect, it } from 'vitest';
import { mockServices, mockUsers } from './mocks';
import { UserDto } from '../common.dto';
import { getUserHandler } from '../get.user.handler';
import { compareUserDtos } from './utils/compareUserDtos';

describe('User', () => {
  describe('Get', () => {
    it('should return the user', async () => {
      const id = '1';
      const mockUser = mockUsers.find(u => u.id === id) as UserDto;
      mockServices.db.userRepository.getById.mockReturnValue(mockUser);

      const user = await getUserHandler({ di: { ...mockServices }, id });

      expect(user).toBeDefined();
      compareUserDtos(user as UserDto, mockUser);
    });

    it('should throw an error when user is not found', async () => {
      const id = '1';
      mockServices.db.userRepository.getById.mockReturnValue(undefined);

      await expect(getUserHandler({ di: { ...mockServices }, id })).rejects.toThrow('User not found');
    });

  });
});
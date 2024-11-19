import { describe, expect, it, vi } from 'vitest';
import { mockServices, mockUsers } from './mocks';
import { UserDto } from '../common.dto';
import { compareUserDtos } from './utils/compareUserDtos';
import { userDetailsHandler } from '../details.user.handler';

describe('User', () => {
  describe('My Details', () => {
    it('should return my details when I send email', async () => {
      const userId = '1';
      const mockUser = mockUsers.find(u => u.id === userId) as UserDto;

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getById: vi.fn().mockReturnValue(mockUser) } } };

      const user = await userDetailsHandler({ di, userId });

      expect(user).toBeDefined();
      compareUserDtos(user, mockUser);
    });
    it('should throw an error when email is not found', async () => {
      const userId = '1';

      const di = {
        ...mockServices,
        db: { ...mockServices.db,
          userRepository: { ...mockServices.db.userRepository,
            getById: vi.fn().mockReturnValue(undefined) } } };

      await expect(userDetailsHandler({ di, userId })).rejects.toThrow('Invalid email or password');
    });
  });
});
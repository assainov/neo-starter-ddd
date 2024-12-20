import { describe, expect, it } from 'vitest';
import { searchUsersHandler } from '../search.user.handler';
import { mockServices, mockUsers } from './mocks';
import { compareUserDtos } from './utils/compareUserDtos';
import { UserDto } from '../common.dto';

describe('User', () => {
  describe('Search', () => {
    it('should return all users', async () => {
      mockServices.db.userRepository.getAll.mockReturnValue(mockUsers);

      const users = await searchUsersHandler({ di: { ...mockServices } });
      users.map((actual, idx) => {
        const expected = mockUsers[idx] as UserDto;

        expect(actual).toBeDefined();
        expect(expected).toBeDefined();
        compareUserDtos(actual, expected);
      });
    });

  });
});

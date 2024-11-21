import { expect } from 'vitest';
import { BaseUser } from '../../IAuthService';

type UserType = BaseUser & Record<string, unknown>;

export function compareUserDtos(actual: UserType, expected: UserType, ) {
  expect(actual).toBeDefined();
  expect(expected).toBeDefined();

  expect(actual.id).toEqual(expected.id);
  expect(actual.passwordHash).toEqual(expected.passwordHash);

  for (const key in expected) {
    if (key === 'id' || key === 'passwordHash') {
      continue;
    }

    expect(actual[key]).toEqual(expected[key]);
  }
}
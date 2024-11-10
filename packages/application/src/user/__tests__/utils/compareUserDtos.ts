import { expect } from 'vitest';
import { UserDto } from '../../common.dto';

export function compareUserDtos(actual: UserDto, expected: UserDto, ) {
  expect(actual).toBeDefined();
  expect(expected).toBeDefined();

  expect(actual.id).toEqual(expected.id);
  expect(actual.firstName).toEqual(expected.firstName);
  expect(actual.lastName).toEqual(expected.lastName);
  expect(actual.email).toEqual(expected.email);
  expect(actual.avatarUrl).toEqual(expected.avatarUrl);
  expect(actual.username).toEqual(expected.username);
  expect(actual.lastLoginAt).toEqual(expected.lastLoginAt);
}
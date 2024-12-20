import { describe, expect, it } from 'vitest';

import request from 'supertest';
import { App } from 'supertest/types';
import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '@neo/common-entities';
import { seedData } from '@neo/persistence/prisma';
import useServer from '@/_server/helpers/tests/useServer';
import useDatabase from '@/_server/helpers/tests/useDatabase';
import {
  SearchUsersResponse,
  UserDto,
  GetUserResponse
} from '@neo/application/user';

describe('User API Endpoints', () => {
  useDatabase();
  const getApp = useServer();

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const app = getApp();

      // Act
      const response = await request(app as App).get('/users');
      const responseBody = response.body as SearchUsersResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody).toBeTruthy();
      expect(responseBody.length).toEqual(2);
      responseBody.forEach((user, index) => { compareUsers(seedData.users[index] as UserDto, user); });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user for a valid ID', async () => {
      // Arrange
      const app = getApp();
      const testId = seedData.users[0]?.id;
      if (!testId) throw new Error('Invalid test data: testId is undefined');

      const expectedUser = seedData.users.find((user) => user.id === testId);

      // Act
      const response = await request(app as App).get(`/users/${testId}`);
      const responseBody = response.body as GetUserResponse;

      // Assert
      expect(expectedUser).toBeDefined();
      expect(response.statusCode).toEqual(StatusCodes.OK);
      compareUsers(expectedUser, responseBody);
    });

    it('should return a not found error for non-existent ID', async () => {
      // Arrange
      const app = getApp();
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app as App).get(`/users/${testId.toString()}`);
      const responseBody = response.body as ErrorResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.code).toEqual('not_found_error');
      expect(responseBody.message).toEqual('User not found');
    });
  });

});

function compareUsers(mockUser?: UserDto, responseUser?: UserDto) {
  if (!mockUser || !responseUser) {
    throw new Error('Invalid test data: mockUser or responseUser is undefined');
  }

  expect(responseUser.id).toEqual(mockUser.id);
  expect(responseUser.firstName).toEqual(mockUser.firstName);
  expect(responseUser.lastName).toEqual(mockUser.lastName);
  expect(responseUser.email).toEqual(mockUser.email);
  expect(responseUser.avatarUrl).toEqual(mockUser.avatarUrl);
  expect(responseUser.username).toEqual(mockUser.username);
}

import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { beforeAll, describe, expect, it } from 'vitest';
import { Application } from 'express';
import container from '@/container';
import { users } from '../_controller.user';
import { UserDto } from '../_common.user';
import { App } from 'supertest/types';
import { ErrorResponse } from '@neo/common-entities';
import { SearchUsersResponse } from '../search.user';
import { GetUserResponse } from '../get.user';

describe('User API Endpoints', () => {
  let app: Application;

  beforeAll(() => {
    const appServer = container.resolve('appServer');
    appServer.configure();
    app = appServer.app;

    // clean up function, called once after all tests run
    return async () => {
      await container.dispose();
    };
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      // Act
      const response = await request(app as App).get('/users');
      const responseBody = response.body as SearchUsersResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody).toBeTruthy();
      expect(responseBody.length).toEqual(2);
      responseBody.forEach((user, index) => { compareUsers(users[index] as UserDto, user); });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user for a valid ID', async () => {
      // Arrange
      const testId = '1';
      const expectedUser = users.find((user) => user.id === testId);

      // Act
      const response = await request(app as App).get(`/users/${testId}`);
      const responseBody = response.body as GetUserResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      if (!expectedUser) throw new Error('Invalid test data: expectedUser is undefined');
      compareUsers(expectedUser, responseBody);
    });

    it('should return a not found error for non-existent ID', async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app as App).get(`/users/${testId.toString()}`);
      const responseBody = response.body as ErrorResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.code).toEqual('not_found');
      expect(responseBody.message).toEqual('User not found');
    });
  });
});

function compareUsers(mockUser?: UserDto, responseUser?: UserDto) {
  if (!mockUser || !responseUser) {
    throw new Error('Invalid test data: mockUser or responseUser is undefined');
  }

  // expect(responseUser.id).toEqual(mockUser.id);
  expect(responseUser.firstName).toEqual(mockUser.firstName);
  expect(responseUser.lastName).toEqual(mockUser.lastName);
  expect(responseUser.email).toEqual(mockUser.email);
  expect(responseUser.avatarUrl).toEqual(mockUser.avatarUrl);
  expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
  expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
}

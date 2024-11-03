import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { beforeAll, describe, expect, it } from 'vitest';
import { Application } from 'express';
import container from '@/container';
import { SearchUsersResponse } from '../searchUsers/searchUsersResponse';
import { GetUserResponse } from '../getUser/getUserResponse';
import { users } from '../userController';
import { UserDto } from '../userDtos/userDtoSchema';
import { ErrorResponse } from '@/ErrorResponse';
import { App } from 'supertest/types';

describe('User API Endpoints', () => {
  let app: Application;

  beforeAll(() => {
    app = container.resolve('app').configure();

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

  expect(responseUser.id).toEqual(mockUser.id);
  expect(responseUser.name).toEqual(mockUser.name);
  expect(responseUser.email).toEqual(mockUser.email);
  expect(responseUser.age).toEqual(mockUser.age);
  expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
  expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
}

import { describe, expect, it } from 'vitest';

import request from 'supertest';
import { App } from 'supertest/types';
import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '@neo/common-entities';
import { seedData } from '@neo/persistence/prisma';
import useServer from '@/_server/helpers/tests/useServer';
import useDatabase from '@/_server/helpers/tests/useDatabase';
import { envConfig } from '@/_server/envConfig';
import JwtTokenService from '@neo/security/jwtTokenService';
import {
  SearchUsersResponse,
  UserDto,
  GetUserResponse,
  RegisterUserResponse,
  LoginUserResponse,
  UserDetailsResponse
} from '@neo/application/user';
import { AccessTokenPayload, TokenGenerationType } from '@neo/domain/refresh-token';
import { logger } from '@neo/express-tools/logger';
import { loginCookieOptions, refreshCookieName } from '../user.config';
import { serialize } from 'cookie';

describe('User API Endpoints', () => {
  useDatabase();
  const getApp = useServer();
  const bob = seedData.users[1];

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

  describe('GET /users/register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const app = getApp();
      const newUser = {
        firstName: 'Charlie',
        lastName: 'Chaplin',
        email: 'charlie@gmail.com',
        password: 'password123',
      };

      // Act
      const response = await request(app as App).post('/users/register').send(newUser);
      const responseBody = response.body as RegisterUserResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody).toBeTruthy();
      expect(responseBody.id).toBeTruthy();
      expect(responseBody.firstName).toEqual(newUser.firstName);
      expect(responseBody.lastName).toEqual(newUser.lastName);
      expect(responseBody.lastLoginAt).toBeDefined();
      expect(responseBody.username).toContain('charlie');
      expect(responseBody.avatarUrl).toBeNull();
    });

    it('should return error if the user email is taken', async () => {
      // Arrange
      const app = getApp();
      const newUser = {
        firstName: 'any',
        lastName: 'any',
        email: seedData.users[0]?.email || '',
        password: 'qwerty'
      };

      // Act
      const response = await request(app as App).post('/users/register').send(newUser);
      const responseBody = response.body as ErrorResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody).toBeTruthy();
      expect(responseBody.code).toEqual('database_error');
      expect(responseBody.message).toEqual(`User with email ${newUser.email} already exists`);
    });
  });

  describe('GET /users/login', () => {
    it('should login successfully and return accessToken', async () => {
      // Arrange
      const app = getApp();
      const existing = {
        email: bob?.email || '',
        password: 'qwerty' // will generate passwordHash of users[1]?.passwordHash
      };

      // Act
      const response = await request(app as App).post('/users/login').send(existing);
      const responseBody = response.body as LoginUserResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.accessToken).toBeTruthy();
      compareUsers(seedData.users[1], responseBody.user);

      const cookieHeader = response.headers['Set-Cookie'] as string;

      expect(cookieHeader).toBeUndefined(); // we expect the Set-Cookie to be secure and non-readable :)
    });

    it('should return invalid credentials', async () => {
      // Arrange
      const app = getApp();
      const existing = {
        email: 'random@email.com',
        password: 'nonexsting'
      };

      // Act
      const response = await request(app as App).post('/users/login').send(existing);
      const responseBody = response.body as ErrorResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody).toBeTruthy();
      expect(responseBody.code).toEqual('bad_request_error');
      expect(responseBody.message).toContain('Invalid');
    });
  });

  describe('POST /users/token', () => {
    it('should refresh the access token', async () => {
      // Arrange
      const app = getApp();
      const existing = {
        email: bob?.email || '',
        password: 'qwerty' // will generate passwordHash of users[1]?.passwordHash
      };
      const refreshCookie = serialize(refreshCookieName, seedData.refreshToken.token, loginCookieOptions);

      // Act
      const response = await request(app as App).post('/users/token').set('Cookie', refreshCookie).send(existing);
      const responseBody = response.body as LoginUserResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.accessToken).toBeTruthy();
    });
  });

  describe('GET /users/me', () => {
    it('should return unauthorized error', async () => {
      // Arrange
      const app = getApp();

      // Act
      const response = await request(app as App).get('/users/me');

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should return user info when authenticated', async () => {
      // Arrange
      const app = getApp();
      const payload: AccessTokenPayload = {
        userId: bob?.id || '',
        generatedBy: TokenGenerationType.UserCredentials
      };

      const tokenService = new JwtTokenService({ envConfig, logger });
      const token = tokenService.generateAccessToken(payload);

      // Act
      const response = await request(app as App).get('/users/me').set('Authorization', `Bearer ${token}`);
      const responseBody = response.body as UserDetailsResponse;

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseBody.id).toBeTruthy();
      expect(responseBody.firstName).toEqual(bob?.firstName);
      expect(responseBody.lastName).toEqual(bob?.lastName);
      expect(responseBody.lastLoginAt).toBeDefined();
      expect(responseBody.username).toContain(bob?.username);
      expect(responseBody.avatarUrl).toEqual(bob?.avatarUrl);
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

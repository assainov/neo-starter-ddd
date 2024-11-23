import { describe, expect, it } from 'vitest';

import request from 'supertest';
import { App } from 'supertest/types';
import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '@neo/common-entities';
import { seedData } from '@neo/persistence/prisma';
import useServer from '@/_server/helpers/tests/useServer';
import useDatabase from '@/_server/helpers/tests/useDatabase';
import { envConfig } from '@/_server/envConfig';
import {
  RegisterUserResponse,
  LoginUserResponse,
  UserDetailsResponse,
  RefreshTokenResponse
} from '@neo/application/auth';
import { logger } from '@neo/express-tools/logger';
import { accessCookieName, loginCookieOptions, refreshCookieName } from '../auth.config';
import { serialize } from 'cookie';
import { AccessTokenPayload, TokenGenerationType, TokenService } from '@neo/security/authService';
import { UserDto } from '@neo/application/user';

describe('Auth API Endpoints', () => {
  useDatabase();
  const getApp = useServer();
  const bob = seedData.users[1];

  describe('GET /auth/register', () => {
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
      const response = await request(app as App).post('/auth/register').send(newUser);
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
      const response = await request(app as App).post('/auth/register').send(newUser);
      const responseBody = response.body as ErrorResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody).toBeTruthy();
      expect(responseBody.code).toEqual('bad_request_error');
      expect(responseBody.message).toEqual(`User with email ${newUser.email} already exists`);
    });
  });

  describe('GET /auth/login', () => {
    it('should login successfully and return user', async () => {
      // Arrange
      const app = getApp();
      const existing = {
        email: bob?.email || '',
        password: 'qwerty' // will generate passwordHash of users[1]?.passwordHash
      };

      // Act
      const response = await request(app as App).post('/auth/login').send(existing);
      const responseBody = response.body as LoginUserResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
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
      const response = await request(app as App).post('/auth/login').send(existing);
      const responseBody = response.body as ErrorResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody).toBeTruthy();
      expect(responseBody.code).toEqual('bad_request_error');
      expect(responseBody.message).toContain('Invalid');
    });
  });

  describe('POST /auth/token', () => {
    it('should refresh the access token', async () => {
      // Arrange
      const app = getApp();
      const existing = {
        email: bob?.email || '',
        password: 'qwerty' // will generate passwordHash of users[1]?.passwordHash
      };
      const refreshCookie = serialize(refreshCookieName, seedData.refreshToken.token, loginCookieOptions);

      // Act
      const response = await request(app as App).post('/auth/token').set('Cookie', refreshCookie).send(existing);
      const responseBody = response.body as RefreshTokenResponse;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
    });
  });

  describe('GET /auth/my-profile', () => {
    it('should return unauthorized error', async () => {
      // Arrange
      const app = getApp();

      // Act
      const response = await request(app as App).get('/auth/my-profile');

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

      const tokenService = new TokenService({ envConfig, logger });
      const token = tokenService.generateAccessToken(payload);
      const accessTokenCookie = serialize(accessCookieName, token, loginCookieOptions);

      // Act
      const response = await request(app as App)
        .get('/auth/my-profile')
        .set('Cookie', accessTokenCookie);

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

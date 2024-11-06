import type { RequestHandler } from 'express';
import { GetUserResponse } from './getUser/getUserResponse';
import { GetUserParams } from './getUser/getUserParams';
import { SearchUsersResponse } from './searchUsers/searchUsersResponse';
import { searchUsersQuery } from './searchUsers/searchUsersQuery';
import registerUserResponseSchema, { RegisterUserResponse } from './registerUser/registerUserResponse';
import { RegisterUserBody } from './registerUser/registerUserBody';
import { BadRequestError, InternalServerError, NotFoundError } from '@neo/common-entities';
import { IUser, User } from '@neo/domain/user';
import loginUserResponseSchema, { LoginUserResponse } from './loginUser/loginUserResponse';
import { LoginUserBody } from './loginUser/loginUserBody';
import userDtoSchema from './userDtos/userDtoSchema';
import meResponseSchema, { MeResponse } from './me/meResponse';

export const users: IUser[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    registeredAt: new Date(),
    lastLoginAt: new Date(),
    loginsCount: 1,
    avatarUrl: 'https://example.com/avatar/johndoe.png',
    username: 'johndoe',
    passwordHash: 'hashedpassword1',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    registeredAt: new Date(),
    lastLoginAt: new Date(),
    loginsCount: 1,
    avatarUrl: 'https://example.com/avatar/janesmith.png',
    username: 'janesmith',
    passwordHash: 'hashedpassword2',
  }
];

class UserController {
  public getUsers: RequestHandler<never, SearchUsersResponse, never, searchUsersQuery> = (_req, res) => {
    res.status(200).send(users);
  };

  public getUser: RequestHandler<GetUserParams, GetUserResponse, never, never> = (req, res) => {
    const { email } = req.params;

    const user = users.find((user) => user.email === email);

    if (!user) throw new NotFoundError('User not found');

    res.status(200).send(user);
  };

  public registerUser: RequestHandler<never, RegisterUserResponse, RegisterUserBody, never> = async (req, res) => {
    const encryptionService = req.container?.resolve('encryptionService');
    if (!encryptionService) throw new InternalServerError('Encryption service not found in container');

    const newUser = await User.create(req.body, encryptionService);
    const userObject = registerUserResponseSchema.parse(newUser);

    users.push(userObject);
    res.status(200).send(userObject);
  };

  public loginUser: RequestHandler<never, LoginUserResponse, LoginUserBody, never> = async (req, res) => {
    const encryptionService = req.container?.resolve('encryptionService');
    if (!encryptionService) throw new InternalServerError('Encryption service not found in container');
    const tokenService = req.container?.resolve('tokenService');
    if (!tokenService) throw new InternalServerError('Encryption service not found in container');

    const { email, password } = req.body;

    const userIndex = users.findIndex((user) => user.email === email);

    if (!users[userIndex]) throw new BadRequestError('Invalid email or password');

    const properUser = new User(users[userIndex]);

    const { error, accessToken } = await properUser.login(password, encryptionService, tokenService);

    if (error) throw new BadRequestError(error);

    users[userIndex] = { ...users[userIndex], ...userDtoSchema.parse(properUser) };

    res.status(200).send(loginUserResponseSchema.parse({ accessToken }));
  };

  public me: RequestHandler<never, MeResponse, never, never> = (req, res) => {
    const encryptionService = req.container?.resolve('encryptionService');
    if (!encryptionService) throw new InternalServerError('Encryption service not found in container');
    const tokenService = req.container?.resolve('tokenService');
    if (!tokenService) throw new InternalServerError('Encryption service not found in container');

    const email = req.tokenPayload?.email;

    if (!email) throw new InternalServerError('Email not found in token payload');

    const user = users.find((user) => user.email === email);

    if (!user) throw new BadRequestError('Invalid email or password');

    res.status(200).send(meResponseSchema.parse(user));
  };
}

export const userController = new UserController();
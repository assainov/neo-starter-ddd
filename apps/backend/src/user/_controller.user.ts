import type { RequestHandler } from 'express';
import { BadRequestError, InternalServerError, NotFoundError } from '@neo/common-entities';
import { IEncryptionService, ITokenService, IUser, User } from '@neo/domain/user';
import userDtoSchema from './_common.user';
import { UserContainerRegistry } from './_container.user';
import { UserDetailsResponse, userDetailsResponseSchema } from './details.user';
import { SearchUsersQuery, SearchUsersResponse } from './search.user';
import { GetUserParams, GetUserResponse } from './get.user';
import { RegisterUserBody, RegisterUserResponse, registerUserResponseSchema } from './register.user';
import { LoginUserBody, LoginUserResponse, loginUserResponseSchema } from './login.user';

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

export class UserController {
  private _encryptionService: IEncryptionService;
  private _tokenService: ITokenService;

  public constructor({ encryptionService, tokenService }: UserContainerRegistry) {
    this._encryptionService = encryptionService;
    this._tokenService = tokenService;
  }

  public search: RequestHandler<never, SearchUsersResponse, never, SearchUsersQuery> = (_req, res) => {
    res.status(200).send(users);
  };

  public get: RequestHandler<GetUserParams, GetUserResponse, never, never> = (req, res) => {
    const { email } = req.params;

    const user = users.find((user) => user.email === email);

    if (!user) throw new NotFoundError('User not found');

    res.status(200).send(user);
  };

  public register: RequestHandler<never, RegisterUserResponse, RegisterUserBody, never> = async (req, res) => {
    const newUser = await User.create(req.body, this._encryptionService);
    const userObject = registerUserResponseSchema.parse(newUser);

    users.push(userObject);
    res.status(200).send(userObject);
  };

  public login: RequestHandler<never, LoginUserResponse, LoginUserBody, never> = async (req, res) => {
    const { email, password } = req.body;

    const userIndex = users.findIndex((user) => user.email === email);

    if (!users[userIndex]) throw new BadRequestError('Invalid email or password');

    const properUser = new User(users[userIndex]);

    const { error, accessToken } = await properUser.login(password, this._encryptionService, this._tokenService);

    if (error) throw new BadRequestError(error);

    users[userIndex] = { ...users[userIndex], ...userDtoSchema.parse(properUser) };

    res.status(200).send(loginUserResponseSchema.parse({ accessToken }));
  };

  public details: RequestHandler<never, UserDetailsResponse, never, never> = (req, res) => {
    const email = req.tokenPayload?.email;

    if (!email) throw new InternalServerError('Email not found in token payload');

    const user = users.find((user) => user.email === email);

    if (!user) throw new BadRequestError('Invalid email or password');

    res.status(200).send(userDetailsResponseSchema.parse(user));
  };
}
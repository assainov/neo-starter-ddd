import type { RequestHandler } from 'express';
import { BadRequestError, InternalServerError, NotFoundError, ValidationError } from '@neo/common-entities';
import { User } from '@neo/domain/user';
import { UserContainerRegistry } from './_container.user';
import { UserDetailsResponse, userDetailsResponseSchema } from './details.user';
import { SearchUsersQuery, SearchUsersResponse, searchUsersResponseSchema } from './search.user';
import { GetUserParams, GetUserResponse, getUserResponseSchema } from './get.user';
import { RegisterUserBody, RegisterUserResponse, registerUserResponseSchema } from './register.user';
import { LoginUserBody, LoginUserResponse, loginUserResponseSchema } from './login.user';
import { StatusCodes } from 'http-status-codes';
import { PrismaClientKnownRequestError } from '@neo/persistence/prisma';

export class UserController {
  public constructor(private _registry: UserContainerRegistry) {}

  public search: RequestHandler<never, SearchUsersResponse, never, SearchUsersQuery> = async(_req, res) => {
    const users = await this._registry.db.userRepository.getAll();

    res.status(200).send(searchUsersResponseSchema.parse(users));
  };

  public get: RequestHandler<GetUserParams, GetUserResponse, never, never> = async (req, res) => {
    const { id } = req.params;

    const user = await this._registry.db.userRepository.getById(id);

    if (!user) throw new NotFoundError('User not found');

    res.status(200).send(getUserResponseSchema.parse(user));
  };

  public register: RequestHandler<never, RegisterUserResponse, RegisterUserBody, never> = async (req, res) => {
    const newUser = await User.create(req.body, this._registry.encryptionService);
    try {
      const user = await this._registry.db.userRepository.create(newUser);
      res.status(StatusCodes.CREATED).send(registerUserResponseSchema.parse(user));
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ValidationError(`User with email ${newUser.email} already exists`);
      }
      throw error;
    }

  };

  public login: RequestHandler<never, LoginUserResponse, LoginUserBody, never> = async (req, res) => {
    const { email, password } = req.body;

    const user = await this._registry.db.userRepository.getByEmail(email);

    if (!user) throw new BadRequestError('Invalid email or password');

    const { error, accessToken } = await user.login(password, this._registry.encryptionService, this._registry.tokenService);

    if (error) throw new BadRequestError(error);

    await this._registry.db.userRepository.update(user);

    res.status(200).send(loginUserResponseSchema.parse({ accessToken }));
  };

  public details: RequestHandler<never, UserDetailsResponse, never, never> = async (req, res) => {
    const email = req.tokenPayload?.email;

    if (!email) throw new InternalServerError('Email not found in token payload');

    const user = await this._registry.db.userRepository.getByEmail(email);

    if (!user) throw new BadRequestError('Invalid email or password');

    res.status(200).send(userDetailsResponseSchema.parse(user));
  };
}
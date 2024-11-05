import type { RequestHandler } from 'express';
import { GetUserResponse } from './getUser/getUserResponse';
import { GetUserParams } from './getUser/getUserParams';
import { SearchUsersResponse } from './searchUsers/searchUsersResponse';
import { searchUsersQuery } from './searchUsers/searchUsersQuery';
import { RegisterUserResponse } from './registerUser/registerUserResponse';
import { RegisterUserBody } from './registerUser/registerUserBody';
import UserDtoSchema from './userDtos/userDtoSchema';
import { randomUUID } from 'node:crypto';
import { NotFoundError } from '@/common/customErrors/NotFoundError';

export const users = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    age: 42,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: '2',
    name: 'Robert',
    email: 'Robert@example.com',
    age: 21,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
];

class UserController {
  public getUsers: RequestHandler<never, SearchUsersResponse, never, searchUsersQuery> = (_req, res) => {
    res.status(200).send(users);
  };

  public getUser: RequestHandler<GetUserParams, GetUserResponse, never, never> = (req, res) => {
    const id = req.params.id;

    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundError('User not found');

    res.status(200).send(user);
  };

  public registerUser: RequestHandler<never, RegisterUserResponse, RegisterUserBody, never> = (req, res) => {
    const newUser = UserDtoSchema.parse({
      ...req.body,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    users.push(newUser);

    res.status(200).send(newUser);
  };
}

export const userController = new UserController();

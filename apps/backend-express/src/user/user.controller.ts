import type { Request, Response, Router } from 'express';
import {
  searchUsersHandler,
  SearchUsersQuery,
  searchUsersRequestSchema,
  SearchUsersResponse,
  getUserHandler,
  GetUserParams,
  getUserRequestSchema,
  GetUserResponse,
  IUserDI,
} from '@neo/application/user';
import { validate } from '@neo/express-tools/validation';

const createUserController = (di: IUserDI) => (userRouter: Router) => {
  userRouter.get('/', validate(searchUsersRequestSchema), async(_req: Request<never, SearchUsersResponse, never, SearchUsersQuery>, res: Response<SearchUsersResponse>) => {
    const result = await searchUsersHandler({ di });

    res.status(200).send(result);
  });
  userRouter.get('/:id', validate(getUserRequestSchema), async (req: Request<GetUserParams, GetUserResponse, never, never>, res: Response<GetUserResponse>) => {
    const { id } = req.params;

    const result = await getUserHandler({ id, di });

    res.status(200).send(result);
  });
};

export type UserController = ReturnType<typeof createUserController>;
export default createUserController;
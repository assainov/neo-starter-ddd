import type { Request, Response, Router } from 'express';
import { UserDI } from './user.di';
import { userDetailsHandler, userDetailsRequestSchema, UserDetailsResponse, } from '../details.user.handler';
import { searchUsersHandler, SearchUsersQuery, searchUsersRequestSchema, SearchUsersResponse, } from '../search.user.handler';
import { getUserHandler, GetUserParams, getUserRequestSchema, GetUserResponse, } from '../get.user.handler';
import { RegisterUserBody, registerUserHandler, registerUserRequestSchema, RegisterUserResponse, } from '../register.user.handler';
import { LoginUserBody, loginUserHandler, loginUserRequestSchema, LoginUserResponse, } from '../login.user.handler';
import { StatusCodes } from 'http-status-codes';
import { authenticate } from '@/_server/middleware/authenticate';
import { validate } from '@neo/express-tools/validation';

const createUserController = (di: UserDI) => (userRouter: Router) => {
  userRouter.get('/', validate(searchUsersRequestSchema), async(_req: Request<never, SearchUsersResponse, never, SearchUsersQuery>, res: Response<SearchUsersResponse>) => {
    const result = await searchUsersHandler({ di });

    res.status(200).send(result);
  });

  userRouter.get('/me', validate(userDetailsRequestSchema), authenticate, async (req: Request<never, UserDetailsResponse, never, never>, res: Response<UserDetailsResponse>) => {
    const email = req.tokenPayload?.email;

    const result = await userDetailsHandler({ email, di });

    res.status(200).send(result);
  });

  userRouter.get('/:id', validate(getUserRequestSchema), async (req: Request<GetUserParams, GetUserResponse, never, never>, res: Response<GetUserResponse>) => {
    const { id } = req.params;

    const result = await getUserHandler({ id, di });

    res.status(200).send(result);
  });

  userRouter.post('/register', validate(registerUserRequestSchema), async (req: Request<never, RegisterUserResponse, RegisterUserBody, never>, res: Response<RegisterUserResponse>) => {
    const result = await registerUserHandler({ newUserDto: req.body, di });

    res.status(StatusCodes.CREATED).send(result);
  });

  userRouter.post('/login', validate(loginUserRequestSchema), async (req: Request<never, LoginUserResponse, LoginUserBody, never>, res: Response<LoginUserResponse>) => {
    const result = await loginUserHandler({ loginDto: req.body, di });

    res.status(StatusCodes.OK).send(result);
  });
};

export type UserController = ReturnType<typeof createUserController>;
export default createUserController;
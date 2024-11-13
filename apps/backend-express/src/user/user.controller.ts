import type { Request, Response, Router } from 'express';
import {
  userDetailsHandler,
  userDetailsRequestSchema,
  UserDetailsResponse,
  searchUsersHandler,
  SearchUsersQuery,
  searchUsersRequestSchema,
  SearchUsersResponse,
  getUserHandler,
  GetUserParams,
  getUserRequestSchema,
  GetUserResponse,
  RegisterUserBody,
  registerUserHandler,
  registerUserRequestSchema,
  RegisterUserResponse,
  LoginUserBody,
  loginUserHandler,
  loginUserRequestSchema,
  LoginUserResponse,
  IUserDI,
  LogoutUserResponse,
} from '@neo/application/user';
import { StatusCodes } from 'http-status-codes';
import { authenticate } from '@/_server/middleware/authenticate';
import { validate } from '@neo/express-tools/validation';
import { serialize } from 'cookie';
import { authCookieName, loginCookieOptions, logoutCookieOptions } from './user.config';

const createUserController = (di: IUserDI) => (userRouter: Router) => {
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
    const { accessToken, user } = await loginUserHandler({ loginDto: req.body, di });

    const authCookie = serialize(authCookieName, accessToken, loginCookieOptions);

    res
      .status(StatusCodes.OK)
      .setHeader('Set-Cookie', authCookie)
      .send(user);
  });

  userRouter.post('/logout', authenticate, async (req: Request<never, LogoutUserResponse, never, never>, res: Response<LogoutUserResponse>) => {
    // Clear the auth cookie
    const authCookie = serialize(authCookieName, '', logoutCookieOptions);

    res
      .status(StatusCodes.OK)
      .setHeader('Set-Cookie', authCookie)
      .send({
        success: true
      });
  });
};

export type UserController = ReturnType<typeof createUserController>;
export default createUserController;
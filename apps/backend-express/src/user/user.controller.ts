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
  refreshTokenHandler,
  refreshTokenRequestSchema,
  RefreshTokenBody,
  RefreshTokenResponse,
  logoutUserHandler,
  revokeTokenRequestSchema,
  RevokeTokenResponse,
  revokeTokenHandler,
  RevokeTokenBody,
} from '@neo/application/user';
import { StatusCodes } from 'http-status-codes';
import { authenticate } from '@/_server/middleware/authenticate';
import { validate } from '@neo/express-tools/validation';
import { serialize } from 'cookie';
import { refreshCookieName, loginCookieOptions, logoutCookieOptions } from './user.config';

const createUserController = (di: IUserDI) => (userRouter: Router) => {
  userRouter.get('/', validate(searchUsersRequestSchema), async(_req: Request<never, SearchUsersResponse, never, SearchUsersQuery>, res: Response<SearchUsersResponse>) => {
    const result = await searchUsersHandler({ di });

    res.status(200).send(result);
  });

  userRouter.get('/me', validate(userDetailsRequestSchema), authenticate, async (req: Request<never, UserDetailsResponse, never, never>, res: Response<UserDetailsResponse>) => {
    const userId = req.tokenPayload?.userId;

    const result = await userDetailsHandler({ userId, di });

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
    const { accessToken, refreshToken, user } = await loginUserHandler({ loginDto: req.body, di });

    const refreshTokenCookie = serialize(refreshCookieName, refreshToken, loginCookieOptions);

    res
      .status(StatusCodes.OK)
      .setHeader('Set-Cookie', refreshTokenCookie)
      .send({ accessToken, user });
  });

  userRouter.post('/token', validate(refreshTokenRequestSchema), async (req: Request<never, RefreshTokenResponse, RefreshTokenBody, never>, res: Response<RefreshTokenResponse>) => {
    const refreshToken = req.cookies[refreshCookieName];

    const { accessToken } = await refreshTokenHandler({ refreshToken, di });

    res
      .status(StatusCodes.OK)
      .send({ accessToken });
  });

  userRouter.post('/logout', authenticate, async (req: Request<never, LogoutUserResponse, never, never>, res: Response<LogoutUserResponse>) => {
    const refreshToken = req.cookies[refreshCookieName];

    const result = await logoutUserHandler({ refreshToken, di });
    // Clear the auth cookie
    const EMPTY = '';
    const refreshCookie = serialize(refreshCookieName, EMPTY, logoutCookieOptions);

    res
      .status(StatusCodes.OK)
      .setHeader('Set-Cookie', refreshCookie)
      .send(result);
  });

  userRouter.post('/token/revoke', authenticate, validate(revokeTokenRequestSchema), async (req: Request<never, RevokeTokenResponse, RevokeTokenBody, never>, res: Response<RevokeTokenResponse>) => {
    const result = await revokeTokenHandler({ id: req.body.id, di });

    res.status(StatusCodes.OK).send(result);
  });
};

export type UserController = ReturnType<typeof createUserController>;
export default createUserController;
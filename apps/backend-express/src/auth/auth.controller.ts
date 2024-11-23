import type { Request, Response, Router } from 'express';
import {
  userDetailsRequestSchema,
  UserDetailsResponse,
  RegisterUserBody,
  registerUserRequestSchema,
  RegisterUserResponse,
  LoginUserBody,
  loginUserRequestSchema,
  LoginUserResponse,
  LogoutUserResponse,
  refreshTokenRequestSchema,
  RefreshTokenBody,
  RefreshTokenResponse,
  revokeTokenRequestSchema,
  RevokeTokenResponse,
  RevokeTokenBody,
  loginUserResponseSchema,
  refreshTokenResponseSchema,
  userDetailsResponseSchema,
  registerUserResponseSchema,
} from '@neo/application/auth';
import { StatusCodes } from 'http-status-codes';
import { authenticate } from '@/_server/middleware/authenticate';
import { validate } from '@neo/express-tools/validation';
import { serialize } from 'cookie';
import { refreshCookieName, loginCookieOptions, logoutCookieOptions, accessCookieName } from './auth.config';
import { IAuthDI } from './auth.di';
import { User } from '@neo/domain/user';

const createUserController = (di: IAuthDI) => (authRouter: Router) => {
  authRouter.get('/my-profile', validate(userDetailsRequestSchema), authenticate, async (req: Request<never, UserDetailsResponse, never, never>, res: Response<UserDetailsResponse>) => {
    const userId = req.tokenPayload?.userId;

    const result = await di.authService.getProfile({ userId }, {

      getUserById: async (id: string) => di.db.userRepository.getById(id)

    });

    res.status(200).send(userDetailsResponseSchema.parse(result));
  });

  authRouter.post('/register', validate(registerUserRequestSchema), async (req: Request<never, RegisterUserResponse, RegisterUserBody, never>, res: Response<RegisterUserResponse>) => {
    const result = await di.authService.registerWithPassword({ ...req.body }, {

      getUserByEmail: async (email: string) => di.db.userRepository.getByEmail(email),

      createUser: async (params: { email: string, passwordHash: string }) => {
        const user = User.create({ ...req.body, passwordHash: params.passwordHash });
        const dbUser = await di.db.userRepository.create(user);

        return dbUser;
      }

    });

    res.status(StatusCodes.CREATED).send(registerUserResponseSchema.parse(result));
  });

  authRouter.post('/login', validate(loginUserRequestSchema), async (req: Request<never, LoginUserResponse, LoginUserBody, never>, res: Response<LoginUserResponse>) => {
    const { session, user } = await di.authService.loginWithPassword({ ...req.body }, {

      getUserByEmail: async (email: string) => di.db.userRepository.getByEmail(email),

      updateUser: async (user) => {
        const userToUpdate = User.toClass(user as User);

        userToUpdate.onLogin();

        await di.db.userRepository.update(userToUpdate);
      },

      createRefreshToken: async (refreshToken) => { await di.db.refreshTokenRepository.create(refreshToken); }

    });

    const refreshTokenCookie = serialize(refreshCookieName, session.refreshToken, loginCookieOptions);
    const accessTokenCookie = serialize(accessCookieName, session.accessToken, loginCookieOptions);

    res
      .status(StatusCodes.OK)
      .setHeader('Set-Cookie', [ refreshTokenCookie, accessTokenCookie ])
      .send(loginUserResponseSchema.parse({ user }));
  });

  authRouter.post('/token', validate(refreshTokenRequestSchema), async (req: Request<never, RefreshTokenResponse, RefreshTokenBody, never>, res: Response<RefreshTokenResponse>) => {
    const refreshToken = req.cookies[refreshCookieName];

    const accessToken = await di.authService.refreshAccessToken({ refreshToken }, {

      getRefreshTokenById: async (id: string) => di.db.refreshTokenRepository.getById(id),

      updateRefreshToken: async (refreshToken) => { await di.db.refreshTokenRepository.update(refreshToken); }

    });

    const accessTokenCookie = serialize(accessCookieName, accessToken, loginCookieOptions);

    res
      .status(StatusCodes.OK)
      .setHeader('Set-Cookie', accessTokenCookie)
      .send(refreshTokenResponseSchema.parse({ success: true }));
  });

  authRouter.post('/logout', authenticate, async (req: Request<never, LogoutUserResponse, never, never>, res: Response<LogoutUserResponse>) => {
    const refreshToken = req.cookies[refreshCookieName];

    await di.authService.logout({ refreshToken }, {

      getRefreshTokenById: async (id: string) => di.db.refreshTokenRepository.getById(id),

      deleteRefreshToken: async (id: string) => { await di.db.refreshTokenRepository.delete(id); }

    });

    // Clear the auth cookie
    const EMPTY = '';
    const refreshCookie = serialize(refreshCookieName, EMPTY, logoutCookieOptions);
    const accessCookie = serialize(accessCookieName, EMPTY, logoutCookieOptions);

    res
      .status(StatusCodes.OK)
      .setHeader('Set-Cookie', [ refreshCookie, accessCookie ])
      .send({ success: true });
  });

  authRouter.post('/token/revoke', authenticate, validate(revokeTokenRequestSchema), async (req: Request<never, RevokeTokenResponse, RevokeTokenBody, never>, res: Response<RevokeTokenResponse>) => {
    await di.authService.revokeRefreshToken({ refreshTokenId: req.body.id }, {

      getRefreshTokenById: async (id: string) => di.db.refreshTokenRepository.getById(id),

      updateRefreshToken: async (refreshToken) => { await di.db.refreshTokenRepository.update(refreshToken); }

    });

    res.status(StatusCodes.OK).send({ success: true });
  });
};

export type UserController = ReturnType<typeof createUserController>;
export default createUserController;
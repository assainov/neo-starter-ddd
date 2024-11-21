import { InternalServerError, BadRequestError, UnauthorizedError, NotFoundError } from '@neo/common-entities';
import { randomUUID } from 'crypto';
import {
  BaseRegisterParams,
  BaseUser,
  GetProfileHooks,
  GetProfileParams,
  IAuthService,
  LoginResult,
  LoginWithPasswordHooks,
  LoginWithPasswordParams,
  LogoutHooks,
  LogoutParams,
  RefreshAccessTokenHooks,
  RefreshAccessTokenParams,
  RegisterWithPasswordHooks,
  RevokeRefreshTokenHooks,
  RevokeRefreshTokenParams
} from './IAuthService';
import { z } from 'zod';
import { ITokenService, TokenGenerationType } from './services/ITokenService';
import { EncryptionService, TokenService } from './services';

const envConfigSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  ACCESS_EXPIRY_MINUTES: z.coerce.number().min(1),
  REFRESH_EXPIRY_DAYS: z.coerce.number().min(1),
});

const envConfig = envConfigSchema.parse(process.env);

export const createAuthService = ({ logger }: { logger: { error: (...args: unknown[]) => void }}): IAuthService => {
  const encryptionService = new EncryptionService();
  const tokenService = new TokenService({ envConfig, logger });

  return ({
    getProfile: async function (params: GetProfileParams, hooks: GetProfileHooks): Promise<BaseUser> {
      const { userId } = params;
      const { getUserById } = hooks;

      if (!userId) throw new InternalServerError('userId not found in token payload');

      const user = await getUserById(userId);

      if (!user) throw new BadRequestError('Invalid email or password');

      return user;
    },
    loginWithPassword: async function (params: LoginWithPasswordParams, hooks: LoginWithPasswordHooks): Promise<LoginResult<BaseUser>> {
      const { email, password } = params;
      const { getUserByEmail, updateUser, createRefreshToken } = hooks;

      const user = await getUserByEmail(email);

      if (!user) throw new BadRequestError('Invalid email or password');

      const isPasswordValid = await encryptionService.comparePassword(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid email or password');
      }

      const tokenId = randomUUID();

      const { accessToken, refreshToken } = createTokens(tokenService, tokenId, user.id);

      await updateUser(user);
      await createRefreshToken({
        id: tokenId,
        userId: user.id,
        token: refreshToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + tokenService.refreshExpiryDays * 24 * 60 * 60 * 1000),
        lastUsedAt: new Date(),
        revokedAt: null,
      });

      return {
        user,
        session: {
          accessToken,
          refreshToken,
        },
      };
    },
    registerWithPassword: async function (params: BaseRegisterParams, hooks: RegisterWithPasswordHooks): Promise<BaseUser> {
      const { email, password, ...rest } = params;
      const { getUserByEmail, createUser } = hooks;

      const existingUser = await getUserByEmail(email);

      if (existingUser) throw new BadRequestError(`User with email ${email} already exists`);

      const passwordHash = await encryptionService.hashPassword(password);

      const user = await createUser({ email, passwordHash, ...rest });

      return user;
    },
    logout: async function (params: LogoutParams, hooks: LogoutHooks): Promise<void> {
      const { refreshToken } = params;
      const { getRefreshTokenById, deleteRefreshToken } = hooks;

      const { id } = tokenService.verifyRefreshToken(refreshToken);

      const storedRefreshToken = await getRefreshTokenById(id);

      if (!storedRefreshToken) {
        logger.error('Refresh token supplied, but not found in the database');
        throw new UnauthorizedError('Invalid refresh token');
      }

      try {
        await deleteRefreshToken(id);
      } catch (error) {
        // let the user continue logging out
        logger.error('Error deleting refresh token', error);
      }

      return;
    },
    refreshAccessToken: async function (params: RefreshAccessTokenParams, hooks: RefreshAccessTokenHooks): Promise<string> {
      const { refreshToken } = params;
      const { getRefreshTokenById, updateRefreshToken } = hooks;

      const { id } = tokenService.verifyRefreshToken(refreshToken);

      const storedRefreshToken = await getRefreshTokenById(id);

      if (!storedRefreshToken) {
        logger.error('Refresh token supplied, but not found in the database');
        throw new NotFoundError('Refresh token not found');
      }

      if (storedRefreshToken.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedError('Refresh token expired');
      }

      if (storedRefreshToken.revokedAt) {
        throw new UnauthorizedError('Revoked refresh token');
      }

      const lastUsedAt = new Date();

      const accessToken = tokenService.generateAccessToken({
        userId: storedRefreshToken.userId,
        generatedBy: TokenGenerationType.RefreshToken,
      });

      await updateRefreshToken({ ...storedRefreshToken, lastUsedAt });

      return accessToken;
    },
    revokeRefreshToken: async function (params: RevokeRefreshTokenParams, hooks: RevokeRefreshTokenHooks): Promise<void> {
      const { refreshTokenId } = params;
      const { getRefreshTokenById, updateRefreshToken } = hooks;

      const token = await getRefreshTokenById(refreshTokenId);

      if (!token) {
        throw new BadRequestError('Refresh token to revoke was not found');
      }

      if (token.revokedAt) {
        throw new BadRequestError('Refresh token is already revoked');
      }

      token.revokedAt = new Date();

      await updateRefreshToken(token);

      return;
    }
  });
};

const createTokens = (
  tokenService: ITokenService,
  tokenId: string,
  userId?: string,
) => {
  if (!userId) {
    throw new InternalServerError('userId cannot be empty');
  }

  const tokenUserId = userId;

  const refreshToken = tokenService.generateRefreshToken({ id: tokenId, userId: tokenUserId });

  const accessToken = tokenService.generateAccessToken({ userId: tokenUserId, generatedBy: TokenGenerationType.UserCredentials });

  return { refreshToken, accessToken };
};
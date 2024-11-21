import { UnauthorizedError } from '@neo/common-entities';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload, ITokenService, RefreshTokenPayload } from './ITokenService';

export class TokenService implements ITokenService {
  public accessTokenExpiryMinutes: number;
  public refreshExpiryDays: number;

  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private logger: { error: (error: unknown) => void };

  public constructor({ envConfig, logger }: {envConfig: {
    ACCESS_TOKEN_SECRET: string,
    REFRESH_TOKEN_SECRET: string,
    ACCESS_EXPIRY_MINUTES: number;
    REFRESH_EXPIRY_DAYS: number;
   }, logger: { error: (error: unknown) => void }}) {
    if (!envConfig.ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is not set');
    }
    if (!envConfig.REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH_TOKEN_SECRET is not set');
    }
    if (!envConfig.ACCESS_EXPIRY_MINUTES) {
      throw new Error('ACCESS_EXPIRY_MINUTES is not set');
    }
    if (!envConfig.REFRESH_EXPIRY_DAYS) {
      throw new Error('REFRESH_EXPIRY_DAYS is not set');
    }

    this.accessTokenSecret = envConfig.ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret = envConfig.REFRESH_TOKEN_SECRET;
    this.accessTokenExpiryMinutes = envConfig.ACCESS_EXPIRY_MINUTES;
    this.refreshExpiryDays = envConfig.REFRESH_EXPIRY_DAYS;
    this.logger = logger;
  }

  public generateRefreshToken(payload: RefreshTokenPayload): string {
    if (!payload.id) {
      throw new Error('id cannot be empty');
    }
    if (!payload.userId) {
      throw new Error('userId cannot be empty');
    }

    const token = jwt.sign(payload, this.refreshTokenSecret, { expiresIn: this.refreshExpiryDays * 24 * 60 * 60 });

    return token;
  }

  public generateAccessToken(payload: AccessTokenPayload): string {
    if (!payload.userId) {
      throw new Error('userId cannot be empty');
    }
    if (!payload.generatedBy) {
      throw new Error('generatedBy cannot be empty');
    }

    const token = jwt.sign(payload, this.accessTokenSecret, { expiresIn: this.accessTokenExpiryMinutes * 60 });

    return token;
  }

  public verifyAccessToken(token: string): AccessTokenPayload {
    return this.verifyToken<AccessTokenPayload>(token, this.accessTokenSecret);
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.verifyToken<RefreshTokenPayload>(token, this.refreshTokenSecret);
  }

  private verifyToken<T>(token: string, secret: string): T {
    if (!token) {
      throw new UnauthorizedError('Authorization failed');
    }

    try {
      const payload = jwt.verify(token, secret) as T;

      if (!payload) throw new UnauthorizedError('Invalid token');

      return payload;

    } catch (error: unknown) {
      this.logger.error(error);
      throw new UnauthorizedError('Invalid token');
    }
  }
}
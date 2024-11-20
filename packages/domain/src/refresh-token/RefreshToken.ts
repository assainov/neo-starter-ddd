import { Result, result } from '@neo/common-entities';
import { randomUUID } from 'node:crypto';
import { SerializedRefreshToken } from './value-objects';
import { ITokenService, RefreshTokenPayload, TokenGenerationType } from './interfaces/ITokenService';

export class RefreshToken {
  #props: SerializedRefreshToken;

  public get id(): string { return this.#props.id; }
  private set id(value: string) { this.#props.id = value; }

  public get createdAt(): Date { return this.#props.createdAt; }
  private set createdAt(value: Date) { this.#props.createdAt = value; }

  public get expiresAt(): Date { return this.#props.expiresAt; }
  private set expiresAt(value: Date) { this.#props.expiresAt = value; }

  public get lastUsedAt(): Date | undefined | null { return this.#props.lastUsedAt; }
  private set lastUsedAt(value: Date | undefined) { this.#props.lastUsedAt = value; }

  public get revokedAt(): Date | undefined | null { return this.#props.revokedAt; }
  private set revokedAt(value: Date | undefined) { this.#props.revokedAt = value; }

  public get userId(): string | undefined { return this.#props.userId; }
  private set userId(value: string) { this.#props.userId = value; }

  public get token(): string { return this.#props.token; }
  private set token(value: string) { this.#props.token = value; }

  public toJSON() {
    return this.#props;
  }

  public static toClass(token: SerializedRefreshToken) {
    return new RefreshToken(token);
  }

  private constructor(props: SerializedRefreshToken) {
    this.#props = props;
  }

  public static createTokens(
    tokenService: ITokenService,
    userId?: string,
  ) {
    if (!userId) {
      return result.fail('userId cannot be empty');
    }

    const payload: RefreshTokenPayload = {
      id: randomUUID(),
      userId,
    };

    const token = tokenService.generateRefreshToken(payload);

    const refreshTokenInstance = new RefreshToken({
      ...payload,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + tokenService.refreshExpiryDays * 24 * 60 * 60 * 1000),
      token
    });

    const accessTokenResult = refreshTokenInstance.createAccessToken(tokenService, TokenGenerationType.UserCredentials);

    if (!accessTokenResult.isSuccess) return result.fail(accessTokenResult.error);

    return result.succeed({ refreshTokenInstance, accessToken: accessTokenResult.data });
  }

  public createAccessToken(tokenService: ITokenService, generatedBy: TokenGenerationType) {
    if (!this.userId) {
      return result.fail('userId cannot be empty');
    }

    const payload = {
      userId: this.userId,
      generatedBy,
    };

    this.lastUsedAt = new Date();

    return result.succeed(tokenService.generateAccessToken(payload));
  }

  public revokeToken(): Result<boolean, string> {
    if (this.revokedAt) {
      return result.fail('refresh token is already revoked');
    }

    this.revokedAt = new Date();

    return result.succeed(true);
  }
}
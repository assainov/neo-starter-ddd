
export interface ITokenService {
  accessTokenExpiryMinutes: number;
  refreshExpiryDays: number;

  generateAccessToken: (payload: AccessTokenPayload) => string;
  generateRefreshToken: (payload: RefreshTokenPayload) => string;
  verifyAccessToken: (token: string) => AccessTokenPayload;
  verifyRefreshToken: (token: string) => RefreshTokenPayload;
}

export enum TokenGenerationType {
  UserCredentials = 'UserCredentials',
  RefreshToken = 'RefreshToken',
}

export type AccessTokenPayload = {
  userId: string;
  generatedBy: TokenGenerationType;
};

export type RefreshTokenPayload = {
  id: string;
  userId: string;
}
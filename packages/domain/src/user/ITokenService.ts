export interface ITokenService {
  generateToken: (payload: TokenPayload) => string;
}

export type TokenPayload = {
  email: string;
  lastLoginAt: Date;
};
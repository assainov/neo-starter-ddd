export interface ITokenService {
  generateToken: (payload: TokenPayload) => string;
}

export type TokenPayload = {
  id: string;
  email: string;
  lastLoginAt: Date;
};
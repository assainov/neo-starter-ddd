import { RefreshToken } from './RefreshToken';

export interface IRefreshTokenRepository {
  getById: (id: string) => Promise<RefreshToken | null>;
  update: (token: RefreshToken) => Promise<RefreshToken>;
  create: (token: RefreshToken) => Promise<RefreshToken>;
  delete: (id: string) => Promise<void>;
}
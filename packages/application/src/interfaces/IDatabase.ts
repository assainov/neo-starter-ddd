import { IUserRepository } from '@neo/domain/user';
import { IRefreshTokenRepository } from '../auth/interfaces/IRefreshTokenRepository';

export interface IDatabase {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  disconnect: () => Promise<void>;
}
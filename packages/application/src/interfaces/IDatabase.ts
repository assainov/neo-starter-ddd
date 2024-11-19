import { ITokenRepository } from '@neo/domain/refresh-token';
import { IUserRepository } from '@neo/domain/user';

export interface IDatabase {
  userRepository: IUserRepository;
  tokenRepository: ITokenRepository;
  disconnect: () => Promise<void>;
}
import { IUserRepository } from '@neo/domain/user';

export interface IDatabase {
  userRepository: IUserRepository;
  disconnect: () => Promise<void>;
}
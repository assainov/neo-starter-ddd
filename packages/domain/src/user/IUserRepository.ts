import { User } from './User';

export interface IUserRepository {
  getAll: () => Promise<User[]>;
  getByEmail: (email: string) => Promise<User | null>;
  getById: (id: string) => Promise<User | null>;
  create: (user: User) => Promise<User>;
  update: (user: User) => Promise<User>;
}
import { IUser } from './IUser';

export interface IUserRepository {
  getAll: () => Promise<IUser[]>;
  findByEmail: (email: string) => Promise<IUser | null>;
  create: (user: IUser) => Promise<IUser>;
  update: (user: IUser) => Promise<IUser>;
}
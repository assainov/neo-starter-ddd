export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  registeredAt: Date;
  lastLoginAt: Date;
  loginsCount: number;
  avatarUrl?: string;
  username: string;
  passwordHash: string;
}
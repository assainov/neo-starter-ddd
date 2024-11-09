import { BaseUserProps } from './BaseUserProps';

export type SerializedUser = Omit<BaseUserProps, 'username'> & {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  registeredAt: Date;
  lastLoginAt: Date;
  loginsCount: number;
  passwordHash: string;

  username: string;
};

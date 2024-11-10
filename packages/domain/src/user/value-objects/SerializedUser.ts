import { BaseUserProps } from './BaseUserProps';

export type SerializedUser = Omit<BaseUserProps, 'username'> & {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  loginsCount: number;
  passwordHash: string;

  username: string;
};

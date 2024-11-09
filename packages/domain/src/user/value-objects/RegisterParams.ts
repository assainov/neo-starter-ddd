import { BaseUserProps } from './BaseUserProps';

export type RegisterParams = BaseUserProps & {
  password: string;
};
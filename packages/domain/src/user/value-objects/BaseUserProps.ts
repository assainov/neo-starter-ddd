export type BaseUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  username?: string;
  passwordHash: string;
};
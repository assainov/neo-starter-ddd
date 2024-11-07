export type NewUserDraft = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  username?: string;
};
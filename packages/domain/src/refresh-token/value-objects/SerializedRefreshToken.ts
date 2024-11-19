export type SerializedRefreshToken = {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date | null;
  revokedAt?: Date | null;
  userId: string;
  token: string;
};

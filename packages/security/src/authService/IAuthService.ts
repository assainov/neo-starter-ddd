export type BaseUser = {
  id: string;
  passwordHash: string;
}

export type BaseRegisterParams = {
  email: string;
  password: string;
}

export type TokenSession = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResult<T extends BaseUser> = {
  session: TokenSession,
  user: T;
};

export type LoginWithPasswordParams = {
  email: string;
  password: string;
};

export type LogoutParams = {
  refreshToken: string;
}

type AuthRefreshToken = {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date | null;
  revokedAt?: Date | null;
  userId: string;
  token: string;
};

type CreateUserHookParams = Omit<BaseRegisterParams, 'password'> & {passwordHash: string};

export type GetProfileHooks = Pick<AuthHooks, 'getUserById'>;
export type LoginWithPasswordHooks = Pick<AuthHooks, 'getUserByEmail' | 'updateUser' | 'createRefreshToken'>;
export type RegisterWithPasswordHooks = Pick<AuthHooks, 'getUserByEmail' | 'createUser'>;
export type LogoutHooks = Pick<AuthHooks, 'getRefreshTokenById' | 'deleteRefreshToken'>;
export type RefreshAccessTokenHooks = Pick<AuthHooks, 'getRefreshTokenById' | 'updateRefreshToken'>;
export type RevokeRefreshTokenHooks = Pick<AuthHooks, 'getRefreshTokenById' | 'updateRefreshToken'>;

export type AuthHooks = {
  createUser: (registerUserParamsSanitized: CreateUserHookParams) => Promise<BaseUser>;
  updateUser: (user: BaseUser) => Promise<void>;
  getUserById: (id: string) => Promise<BaseUser | null>;
  getUserByEmail: (email: string) => Promise<BaseUser | null>;
  createRefreshToken: (refreshToken: AuthRefreshToken) => Promise<void>;
  getRefreshTokenById: (id: string) => Promise<AuthRefreshToken | null>;
  updateRefreshToken: (refreshToken: AuthRefreshToken) => Promise<void>;
  deleteRefreshToken: (id: string) => Promise<void>;
}

export type GetProfileParams = {
  userId: string;
}

export type RefreshAccessTokenParams = {
  refreshToken: string;
}

export type RevokeRefreshTokenParams = {
  refreshTokenId: string;
}

export type IAuthService = {
  getProfile(params: GetProfileParams, hooks: GetProfileHooks): Promise<BaseUser>;
  loginWithPassword(params: LoginWithPasswordParams, hooks: LoginWithPasswordHooks): Promise<LoginResult<BaseUser>>;
  registerWithPassword(params: BaseRegisterParams, hooks: RegisterWithPasswordHooks): Promise<BaseUser>;
  logout(params: LogoutParams, hooks: LogoutHooks): Promise<void>;
  refreshAccessToken(params: RefreshAccessTokenParams, hooks: RefreshAccessTokenHooks): Promise<string>;
  revokeRefreshToken(params: RevokeRefreshTokenParams, hooks: RevokeRefreshTokenHooks): Promise<void>;
}
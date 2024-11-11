import { SerializedUser } from './value-objects/SerializedUser';
import { LoginResult } from './value-objects/LoginResult';
import { IEncryptionService, ITokenService } from './interfaces';
import { RegisterParams } from './value-objects';

export class User {
  #props: SerializedUser;

  public get id(): string | undefined { return this.#props.id; }
  private set id(value: string | undefined) { this.#props.id = value; }

  public get firstName(): string { return this.#props.firstName; }
  private set firstName(value: string) { this.#props.firstName = value; }

  public get lastName(): string { return this.#props.lastName; }
  private set lastName(value: string) { this.#props.lastName = value; }

  public get email(): string { return this.#props.email; }
  private set email(value: string) { this.#props.email = value; }

  public get createdAt(): Date { return this.#props.createdAt; }
  private set createdAt(value: Date) { this.#props.createdAt = value; }

  public get updatedAt(): Date { return this.#props.updatedAt; }
  private set updatedAt(value: Date) { this.#props.updatedAt = value; }

  public get lastLoginAt(): Date { return this.#props.lastLoginAt; }
  private set lastLoginAt(value: Date) { this.#props.lastLoginAt = value; }

  public get loginsCount(): number { return this.#props.loginsCount; }
  private set loginsCount(value: number) { this.#props.loginsCount = value; }

  public get avatarUrl(): string | undefined | null { return this.#props.avatarUrl; }
  private set avatarUrl(value: string | undefined) { this.#props.avatarUrl = value; }

  public get username(): string { return this.#props.username; }
  private set username(value: string) { this.#props.username = value; }

  public get passwordHash(): string { return this.#props.passwordHash; }
  private set passwordHash(value: string) { this.#props.passwordHash = value; }

  public toJSON() {
    return this.#props;
  }

  public static toClass(user: SerializedUser) {
    return new User(user);
  }

  public constructor(props: SerializedUser) {
    this.#props = props;
  }

  public static async register(
    params: RegisterParams,
    encryptionService: IEncryptionService
  ) {
    const { firstName, lastName, email, password, avatarUrl, username: usernameOrNull } = params;

    if (!firstName || !lastName || !email || !password) {
      throw new Error('domain/user/validation: Missing required fields');
    }

    if (!User.isValidEmail(email)) {
      throw new Error('domain/user/validation: Invalid email address');
    }

    const passwordHash = await encryptionService.hashPassword(password);

    const createdAt = new Date();
    const updatedAt = new Date();
    const lastLoginAt = new Date();
    const loginsCount = 0;

    const username = usernameOrNull || User.generateUsername(firstName, lastName);

    return new User({
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
      lastLoginAt,
      loginsCount,
      username,
      passwordHash,
      avatarUrl
    });
  }

  public async login(password: string, encryptionService: IEncryptionService, tokenService: ITokenService): Promise<LoginResult> {
    const isPasswordValid = await encryptionService.comparePassword(password, this.passwordHash);
    if (!isPasswordValid) {
      return { error: 'Invalid email or password' };
    }

    this.lastLoginAt = new Date();
    this.loginsCount += 1;
    this.updatedAt = new Date();

    return { accessToken: this.generateAccessToken(tokenService) };
  }

  public changeBasicDetails(firstName: string, lastName: string, email: string, avatarUrl?: string): void {
    if (!firstName || !lastName || !email) {
      throw new Error('domain/user/validation: Missing required fields');
    }

    if (!User.isValidEmail(email)) {
      throw new Error('domain/user/validation: Invalid email address');
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.updatedAt = new Date();
  }

  private generateAccessToken(tokenService: ITokenService): string {
    if (!this.id) {
      throw new Error('domain/user: User ID is required to generate access token');
    }

    const payload = {
      id: this.id,
      email: this.email,
      lastLoginAt: this.lastLoginAt,
    };

    return tokenService.generateToken(payload);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static generateUsername(firstName: string, lastName: string): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomDigits}`;
  }
}
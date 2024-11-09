import { IEncryptionService } from './IEncryptionService';
import { ITokenService } from './ITokenService';
import { UserProps } from './UserProps';
import { LoginResult } from './valueObjects/LoginResult';
import { NewUserDraft } from './valueObjects/NewUserDraft';

export class User {
  #private: UserProps;

  public get id(): string | undefined { return this.#private.id; }
  private set id(value: string | undefined) { this.#private.id = value; }

  public get firstName(): string { return this.#private.firstName; }
  private set firstName(value: string) { this.#private.firstName = value; }

  public get lastName(): string { return this.#private.lastName; }
  private set lastName(value: string) { this.#private.lastName = value; }

  public get email(): string { return this.#private.email; }
  private set email(value: string) { this.#private.email = value; }

  public get createdAt(): Date { return this.#private.createdAt; }
  private set createdAt(value: Date) { this.#private.createdAt = value; }

  public get updatedAt(): Date { return this.#private.updatedAt; }
  private set updatedAt(value: Date) { this.#private.updatedAt = value; }

  public get registeredAt(): Date { return this.#private.registeredAt; }
  private set registeredAt(value: Date) { this.#private.registeredAt = value; }

  public get lastLoginAt(): Date { return this.#private.lastLoginAt; }
  private set lastLoginAt(value: Date) { this.#private.lastLoginAt = value; }

  public get loginsCount(): number { return this.#private.loginsCount; }
  private set loginsCount(value: number) { this.#private.loginsCount = value; }

  public get avatarUrl(): string | undefined | null { return this.#private.avatarUrl; }
  private set avatarUrl(value: string | undefined) { this.#private.avatarUrl = value; }

  public get username(): string { return this.#private.username; }
  private set username(value: string) { this.#private.username = value; }

  public get passwordHash(): string { return this.#private.passwordHash; }
  private set passwordHash(value: string) { this.#private.passwordHash = value; }

  public toJSON() {
    return this.#private;
  }

  public static toClass(props: UserProps) {
    return new User(props);
  }

  public constructor(props: UserProps) {
    this.#private = props;
  }

  public static async create(
    newUserDraft: NewUserDraft,
    encryptionService: IEncryptionService
  ) {
    const { firstName, lastName, email, password, avatarUrl, username: usernameOrNull } = newUserDraft;

    if (!firstName || !lastName || !email || !password) {
      throw new Error('domain/user/validation: Missing required fields');
    }

    if (!User.isValidEmail(email)) {
      throw new Error('domain/user/validation: Invalid email address');
    }

    const passwordHash = await encryptionService.hashPassword(password);

    const createdAt = new Date();
    const updatedAt = new Date();
    const registeredAt = new Date();
    const lastLoginAt = new Date();
    const loginsCount = 0;

    const username = usernameOrNull || User.generateUsername(firstName, lastName);

    return new User({
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
      registeredAt,
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
      return { error: 'Invalid password' };
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

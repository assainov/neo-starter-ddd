import { IEncryptionService } from './IEncryptionService';
import { ITokenService } from './ITokenService';
import { IUser } from './IUser';
import { LoginResult } from './valueObjects/LoginResult';
import { NewUserDraft } from './valueObjects/NewUserDraft';

export class User implements IUser {
  public get firstName(): string { return this.#firstName; }
  private set firstName(value: string) { this.#firstName = value; }
  #firstName!: string;

  public get lastName(): string { return this.#lastName; }
  private set lastName(value: string) { this.#lastName = value; }
  #lastName!: string;

  public get email(): string { return this.#email; }
  private set email(value: string) { this.#email = value; }
  #email!: string;

  public get createdAt(): Date { return this.#createdAt; }
  private set createdAt(value: Date) { this.#createdAt = value; }
  #createdAt!: Date;

  public get updatedAt(): Date { return this.#updatedAt; }
  private set updatedAt(value: Date) { this.#updatedAt = value; }
  #updatedAt!: Date;

  public get registeredAt(): Date { return this.#registeredAt; }
  private set registeredAt(value: Date) { this.#registeredAt = value; }
  #registeredAt!: Date;

  public get lastLoginAt(): Date { return this.#lastLoginAt; }
  private set lastLoginAt(value: Date) { this.#lastLoginAt = value; }
  #lastLoginAt!: Date;

  public get loginsCount(): number { return this.#loginsCount; }
  private set loginsCount(value: number) { this.#loginsCount = value; }
  #loginsCount!: number;

  public get avatarUrl(): string | undefined { return this.#avatarUrl; }
  private set avatarUrl(value: string | undefined) { this.#avatarUrl = value; }
  #avatarUrl?: string;

  public get username(): string { return this.#username; }
  private set username(value: string) { this.#username = value; }
  #username!: string;

  public get passwordHash(): string { return this.#passwordHash; }
  private set passwordHash(value: string) { this.#passwordHash = value; }
  #passwordHash!: string;

  public constructor({
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
    avatarUrl,
  }:{
    firstName: string,
    lastName: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    registeredAt: Date,
    lastLoginAt: Date,
    loginsCount: number,
    username: string,
    passwordHash: string,
    avatarUrl?: string,
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.registeredAt = registeredAt;
    this.lastLoginAt = lastLoginAt;
    this.loginsCount = loginsCount;
    this.avatarUrl = avatarUrl;
    this.username = username;
    this.passwordHash = passwordHash;
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
    const payload = {
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

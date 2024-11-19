import { SerializedUser } from './value-objects/SerializedUser';
import { IEncryptionService } from './interfaces';
import { RegisterParams } from './value-objects';
import { Result, result } from '@neo/common-entities';

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

  private constructor(props: SerializedUser) {
    this.#props = props;
  }

  public static async register(
    params: RegisterParams,
    encryptionService: IEncryptionService
  ) {
    const { firstName, lastName, email, password, avatarUrl, username: usernameOrNull } = params;

    if (!firstName || !lastName || !email || !password) {
      return result.fail('domain/user/validation: Missing required fields');
    }

    if (!User.isValidEmail(email)) {
      return result.fail('domain/user/validation: Invalid email address');
    }

    const passwordHash = await encryptionService.hashPassword(password);

    const createdAt = new Date();
    const updatedAt = new Date();
    const lastLoginAt = new Date();
    const loginsCount = 0;

    const username = usernameOrNull || User.generateUsername(firstName, lastName);

    return result.succeed(new User({
      id: undefined,
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
      lastLoginAt,
      loginsCount,
      username,
      passwordHash,
      avatarUrl,
    }));
  }

  public async login(password: string, encryptionService: IEncryptionService) {
    const isPasswordValid = await encryptionService.comparePassword(password, this.passwordHash);
    if (!isPasswordValid) {
      return result.fail('Invalid email or password');
    }

    if (!this.id) {
      return result.fail('User ID is missing');
    }

    this.lastLoginAt = new Date();
    this.loginsCount += 1;
    this.updatedAt = new Date();

    return result.succeed(true);
  }

  public changeBasicDetails(firstName: string, lastName: string, email: string, avatarUrl?: string): Result<boolean, string> {
    if (!firstName || !lastName || !email) {
      return result.fail('Missing required fields');
    }

    if (!User.isValidEmail(email)) {
      return result.fail('Invalid email address');
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.updatedAt = new Date();

    return result.succeed(true);
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
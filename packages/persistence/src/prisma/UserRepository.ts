import { PrismaClient } from '@prisma/client';
import { IUserRepository, User } from '@neo/domain/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';
import { InternalDatabaseError } from '@neo/common-entities';

const isKnownError = (error: unknown) => (error instanceof PrismaClientKnownRequestError);

class UserRepository implements IUserRepository {
  private _prisma: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this._prisma = prismaClient;
  }

  public async getAll() {
    const dbUsers = await this._prisma.user.findMany();
    return dbUsers.map(u => User.toClass(u));
  }

  public async getById(id: string) {

    const dbUser = await this._prisma.user.findUnique({
      where: { id },
    });

    if (!dbUser) return null;

    return User.toClass(dbUser);
  }

  public async getByEmail(email: string) {
    const dbUser = await this._prisma.user.findFirst({
      where: { email },
    });

    if (!dbUser) return null;

    return User.toClass(dbUser);
  }

  public async create(user: User) {
    try {
      const dbUser = await this._prisma.user.create({
        data: user.toJSON(),
      });

      return User.toClass(dbUser);
    } catch (e: unknown) {
      if (!isKnownError(e)) throw e;

      const error = e as PrismaClientKnownRequestError;

      if (
        error.code === PrismaError.UniqueConstraintViolation &&
        (error.meta?.target as string[])[0] === 'email'
      ) {
        throw new InternalDatabaseError(
          `User with email ${user.email} already exists`,
        );
      }

      throw e;
    }
  }

  public async update(user: User) {
    const dbUser = await this._prisma.user.update({
      where: { email: user.email },
      data: user.toJSON()
    });

    return User.toClass(dbUser);
  }
}

export default UserRepository;
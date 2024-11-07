import { PrismaClient } from '@prisma/client';
import { IUser, IUserRepository, User } from '@neo/domain/user';

class UserRepository implements IUserRepository {
  private _prisma: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this._prisma = prismaClient;
  }

  public async getAll(): Promise<IUser[]> {
    const dbUsers = await this._prisma.user.findMany();
    return dbUsers.map(u => new User(u));
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const dbUser = await this._prisma.user.findFirst({
      where: { email }
    });

    if (!dbUser) return null;

    return new User(dbUser);
  }

  public async create(user: IUser): Promise<IUser> {
    const dbUser = await this._prisma.user.create({
      data: user
    });

    return new User(dbUser);
  }

  public async update(user: IUser): Promise<IUser> {
    const dbUser = await this._prisma.user.update({
      where: { email: user.email },
      data: user
    });

    return new User(dbUser);
  }
}

export default UserRepository;
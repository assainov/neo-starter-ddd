import { PrismaClient } from '@prisma/client';
import { IUserRepository, User } from '@neo/domain/user';

class UserRepository implements IUserRepository {
  private _prisma: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this._prisma = prismaClient;
  }

  public async getAll() {
    const dbUsers = await this._prisma.user.findMany();
    return dbUsers.map(u => new User(u));
  }

  public async getById(id: string) {
    const dbUser = await this._prisma.user.findUnique({
      where: { id }
    });

    if (!dbUser) return null;

    return new User(dbUser);
  }

  public async getByEmail(email: string) {
    const dbUser = await this._prisma.user.findFirst({
      where: { email }
    });

    if (!dbUser) return null;

    return new User(dbUser);
  }

  public async create(user: User) {
    const dbUser = await this._prisma.user.create({
      data: user.toJSON()
    });

    return new User(dbUser);
  }

  public async update(user: User) {
    const dbUser = await this._prisma.user.update({
      where: { email: user.email },
      data: user.toJSON()
    });

    return new User(dbUser);
  }
}

export default UserRepository;
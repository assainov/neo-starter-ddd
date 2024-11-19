import { PrismaClient } from '@prisma/client';
import { RefreshToken } from '../../../domain/src/refresh-token/RefreshToken';
import { ITokenRepository } from '@neo/domain/refresh-token';

class TokenRepository implements ITokenRepository {
  private _prisma: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this._prisma = prismaClient;
  }

  public async getById(id: string) {

    const dbToken = await this._prisma.refreshToken.findUnique({
      where: { id },
    });

    if (!dbToken) return null;

    return RefreshToken.toClass(dbToken);
  }

  public async create(refreshToken: RefreshToken) {
    const dbToken = await this._prisma.refreshToken.create({
      data: refreshToken.toJSON(),
    });

    return RefreshToken.toClass(dbToken);
  }

  public async update(refreshToken: RefreshToken) {
    const dbToken = await this._prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: refreshToken.toJSON(),
    });

    return RefreshToken.toClass(dbToken);
  }

  public async delete(id: string) {
    await this._prisma.refreshToken.delete({
      where: { id }
    });
  }
}

export default TokenRepository;
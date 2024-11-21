import { IRefreshTokenRepository, RefreshToken } from '@neo/application/auth';
import { PrismaClient } from '@prisma/client';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  private _prisma: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this._prisma = prismaClient;
  }

  public async getById(id: string): Promise<RefreshToken | null> {

    const dbToken = await this._prisma.refreshToken.findUnique({
      where: { id },
    });

    if (!dbToken) return null;

    return dbToken;
  }

  public async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const dbToken = await this._prisma.refreshToken.create({
      data: refreshToken,
    });

    return dbToken;
  }

  public async update(refreshToken: RefreshToken): Promise<RefreshToken> {
    const dbToken = await this._prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: refreshToken,
    });

    return dbToken;
  }

  public async delete(id: string) {
    await this._prisma.refreshToken.delete({
      where: { id }
    });
  }
}
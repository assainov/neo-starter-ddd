import { PrismaClient } from '@prisma/client';
import UserRepository from './UserRepository';
import { IDatabase } from '@neo/application/interfaces';
import { createPrismaClient } from './createPrismaClient';
import { IRefreshTokenRepository } from '@neo/application/auth';
import { RefreshTokenRepository } from './RefreshTokenRepository';

export class Database implements IDatabase {
  private prisma: PrismaClient;
  public userRepository: UserRepository;
  public refreshTokenRepository: IRefreshTokenRepository;

  public constructor() {
    this.prisma = createPrismaClient();
    this.userRepository = new UserRepository(this.prisma);
    this.refreshTokenRepository = new RefreshTokenRepository(this.prisma);
  }

  public async disconnect() {
    await this.prisma.$disconnect();
  }
}
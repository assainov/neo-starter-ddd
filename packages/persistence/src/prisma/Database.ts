import { PrismaClient } from '@prisma/client';
import UserRepository from './UserRepository';
import { IDatabase } from '@neo/application/interfaces';
import { ITokenRepository } from '@neo/domain/refresh-token';
import TokenRepository from './TokenRepository';
import { createPrismaClient } from './createPrismaClient';

export class Database implements IDatabase {
  private prisma: PrismaClient;
  public userRepository: UserRepository;
  public tokenRepository: ITokenRepository;

  public constructor() {
    this.prisma = createPrismaClient();
    this.userRepository = new UserRepository(this.prisma);
    this.tokenRepository = new TokenRepository(this.prisma);
  }

  public async disconnect() {
    await this.prisma.$disconnect();
  }
}
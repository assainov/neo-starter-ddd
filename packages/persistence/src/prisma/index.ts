import { PrismaClient } from '@prisma/client';
import UserRepository from './UserRepository';
export { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
export * from './helpers';
export * from './seed';

export class Database {
  private prisma: PrismaClient;
  public userRepository: UserRepository;

  public constructor() {
    this.prisma = new PrismaClient();
    this.userRepository = new UserRepository(this.prisma);
  }

  public async disconnect() {
    await this.prisma.$disconnect();
  }
}
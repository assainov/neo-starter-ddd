import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const seedDatabase = async () => {
  await prisma.user.create({ data: alice });

  await prisma.user.create({ data: bob });
};

const alice = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Wonderland',
  email: 'alice@example.com',
  username: 'alice',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  loginsCount: 3,
  avatarUrl: 'https://gravatar.com/avatar/fa5a610e97f1e3a9c319c285fdd5cb03?s=50&d=robohash&r=x',
  passwordHash: 'hashedpassword1',
};

const bob = {
  id: '2',
  firstName: 'Bo',
  lastName: 'Builder',
  email: 'bob@example.com',
  username: 'bob',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  loginsCount: 1,
  avatarUrl: null,
  passwordHash: '$2a$10$4yIqOp0OE85eVwjV99OMLO0HcqgRq7lwn9whrKjZ9wP9BQk1YUgZ.',
};

export const seedData = {
  users: [ alice, bob ]
};
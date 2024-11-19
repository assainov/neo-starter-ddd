import { createPrismaClient } from './createPrismaClient';
const prisma = createPrismaClient();

export const seedDatabase = async () => {
  await prisma.user.create({ data: alice });
  await prisma.user.create({ data: bob });

  await prisma.refreshToken.create({ data: refreshToken });
};

// Reset the database before each test
export const resetDatabase = async () => {
  await prisma.user.deleteMany();
  await prisma.refreshToken.deleteMany();
};

const alice = {
  id: '1deb35ab-e387-4532-936b-6f494538dd0b',
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

const refreshToken = {
  id: '0f10848a-730c-485f-996c-39ceb859b38d',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBmMTA4NDhhLTczMGMtNDg1Zi05OTZjLTM5Y2ViODU5YjM4ZCIsInVzZXJJZCI6IjFkZWIzNWFiLWUzODctNDUzMi05MzZiLTZmNDk0NTM4ZGQwYiIsImlhdCI6MTczMTk5NTc5OSwiZXhwIjoxNzM5NzcxNzk5fQ.qCMVPuy7xOyMzVgsdMITfIVlnYw4OS96R4hAcbMTeYA',
  expiresAt: new Date(+new Date() + 86400000), // tomorrow
  createdAt: new Date(),
  lastUsedAt: new Date(),
  revokedAt: null,
  userId: alice.id
};

export const seedData = {
  users: [ alice, bob ],
  refreshToken
};
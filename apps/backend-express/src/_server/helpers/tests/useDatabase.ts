import { beforeAll, beforeEach } from 'vitest';
import { envConfig } from '../../envConfig';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { resetDatabase, runLatestMigrations, seedDatabase } from '@neo/persistence/prisma';

const url = new URL(envConfig.DATABASE_URL);
const dbContainer = new PostgreSqlContainer()
  .withUsername(url.username)
  .withPassword(url.password)
  .withDatabase(url.pathname.slice(1)) // remove leading slash
  .withExposedPorts({ container: 5432, host: parseInt(url.port) })
  .withReuse();

export default () => {
  beforeAll(async () => {
    const startedContainer = await dbContainer.start();

    await runLatestMigrations();

    // clean up function, called once after all tests run
    return async () => {
      await startedContainer.stop();
    };
  });

  beforeEach(async () => {
    await resetDatabase();
    await seedDatabase();
  });
};
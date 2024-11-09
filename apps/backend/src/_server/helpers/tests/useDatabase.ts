import { beforeAll, beforeEach } from 'vitest';
import { envConfig } from '../../envConfig';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { resetDatabase, runLatestMigrations, seedDatabase } from '@neo/persistence/prisma';

export default () => {
  beforeAll(async () => {
    const url = new URL(envConfig.DATABASE_URL);
    const dbContainer = await new PostgreSqlContainer()
      .withUsername(url.username)
      .withPassword(url.password)
      .withDatabase(url.pathname.slice(1)) // remove leading slash
      .withExposedPorts({ container: parseInt(url.port), host: parseInt(url.port) })
      .start();

    await runLatestMigrations();

    // clean up function, called once after all tests run
    return async () => {
      await dbContainer.stop();
    };
  });

  beforeEach(async () => {
    await resetDatabase();
    await seedDatabase();
  });
};
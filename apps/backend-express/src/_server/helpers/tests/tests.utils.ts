import { EnvConfig } from '@/_server/envConfig';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export const buildDatabaseUrl = (container: StartedPostgreSqlContainer, env: EnvConfig) => {
  const url = new URL(env.DATABASE_URL);

  url.host = container.getHost();
  url.port = container.getMappedPort(5432).toString();
  url.username = container.getUsername();
  url.password = container.getPassword();
  url.pathname = container.getDatabase();

  return url.toString();
};
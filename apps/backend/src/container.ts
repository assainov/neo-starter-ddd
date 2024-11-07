import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { AppServer } from './__server/appServer';
import { envConfig, EnvConfig } from './__server/envConfig';
import { logger, Logger } from '@neo/tools/logger';
import { Database } from '@neo/persistence/prisma';

export type Registry = {
  appServer: AppServer,
  container: Container,
  envConfig: EnvConfig,
  logger: Logger,
  requestId?: string,
  db: Database
}

const container = createContainer<Registry>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  appServer: asClass(AppServer).singleton(),
  container: asValue(container),
  envConfig: asValue(envConfig),
  logger: asValue(logger),
  db: asClass(Database).singleton()
});

export type Container = typeof container;
export default container;
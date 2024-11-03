import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { Server } from './server';
import { App } from './app';
import { envConfig, EnvConfig } from './envConfig';
import logger, { Logger } from './logger';

export type Registry = {
  server: Server,
  app: App,
  container: Container,
  envConfig: EnvConfig,
  logger: Logger,
  requestId?: string,
}

const container = createContainer<Registry>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  server: asClass(Server).singleton(),
  app: asClass(App).singleton(),
  container: asValue(container),
  envConfig: asValue(envConfig),
  logger: asValue(logger),
});

export type Container = typeof container;
export default container;
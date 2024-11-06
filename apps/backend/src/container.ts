import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { HttpServer } from './__server/httpServer';
import { App } from './__server/app';
import { envConfig, EnvConfig } from './__server/envConfig';
import { logger, Logger } from '@neo/tools/logger';
import { IEncryptionService, ITokenService } from '@neo/domain/user';

export type Registry = {
  httpServer: HttpServer,
  app: App,
  container: Container,
  envConfig: EnvConfig,
  logger: Logger,
  requestId?: string,
  encryptionService: IEncryptionService,
  tokenService: ITokenService
}

const container = createContainer<Registry>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  httpServer: asClass(HttpServer).singleton(),
  app: asClass(App).singleton(),
  container: asValue(container),
  envConfig: asValue(envConfig),
  logger: asValue(logger),
});

export type Container = typeof container;
export default container;
import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { AppServer } from './__server/appServer';
import { envConfig, EnvConfig } from './__server/envConfig';
import { logger, Logger } from '@neo/tools/logger';
import { IEncryptionService, ITokenService } from '@neo/domain/user';

export type Registry = {
  appServer: AppServer,
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
  appServer: asClass(AppServer).singleton(),
  container: asValue(container),
  envConfig: asValue(envConfig),
  logger: asValue(logger),
});

export type Container = typeof container;
export default container;
import { Container } from '@/container';
import { IAppRegistry } from '@neo/application/interfaces';
import { createAuthService, IAuthService } from '@neo/security/authService';
import { asFunction } from 'awilix';

export type IAuthDI = {
  authService: IAuthService,
} & IAppRegistry;

export const createAuthContainer = (container: Container) => {
  const authContainer = container.createScope<IAuthDI>();
  authContainer.register({
    authService: asFunction(createAuthService).scoped(),
  });
  return authContainer;
};
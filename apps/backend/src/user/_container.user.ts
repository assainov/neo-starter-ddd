import { asClass } from 'awilix';
import { IEncryptionService, ITokenService } from '@neo/domain/user';
import { EncryptionService } from '@neo/security/encryptionService';
import JwtTokenService from '@neo/security/jwtTokenService';
import { Container, Registry } from '@/container';
import { UserController } from './_controller.user';

export type UserContainerRegistry = {
  userController: UserController,
  encryptionService: IEncryptionService,
  tokenService: ITokenService
} & Registry;

export const createUserContainer = (container: Container) => {
  const userContainer = container.createScope<UserContainerRegistry>();
  userContainer.register({
    userController: asClass(UserController).scoped(),
    encryptionService: asClass(EncryptionService).scoped(),
    tokenService: asClass(JwtTokenService).scoped(),
  });
  return userContainer;
};
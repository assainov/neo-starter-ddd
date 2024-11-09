import { asClass, asFunction } from 'awilix';
import { IEncryptionService, ITokenService } from '@neo/domain/user';
import { EncryptionService } from '@neo/security/encryptionService';
import JwtTokenService from '@neo/security/jwtTokenService';
import { Container, Registry } from '@/container';
import createUserController, { UserController } from './_user.controller';

export type UserDI = {
  userController: UserController,
  encryptionService: IEncryptionService,
  tokenService: ITokenService
} & Registry;

export const createUserContainer = (container: Container) => {
  const userContainer = container.createScope<UserDI>();
  userContainer.register({
    userController: asFunction(createUserController).scoped(),
    encryptionService: asClass(EncryptionService).scoped(),
    tokenService: asClass(JwtTokenService).scoped(),
  });
  return userContainer;
};
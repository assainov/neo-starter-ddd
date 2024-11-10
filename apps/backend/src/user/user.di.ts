import { asClass } from 'awilix';
import { EncryptionService } from '@neo/security/encryptionService';
import JwtTokenService from '@neo/security/jwtTokenService';
import { Container } from '@/container';
import { IUserDI } from '@neo/application/user';

export const createUserContainer = (container: Container) => {
  const userContainer = container.createScope<IUserDI>();
  userContainer.register({
    encryptionService: asClass(EncryptionService).scoped(),
    tokenService: asClass(JwtTokenService).scoped(),
  });
  return userContainer;
};
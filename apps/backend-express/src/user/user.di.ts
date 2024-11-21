import { Container } from '@/container';
import { IUserDI } from '@neo/application/user';

export const createUserContainer = (container: Container) => {
  const userContainer = container.createScope<IUserDI>();
  userContainer.register({});
  return userContainer;
};
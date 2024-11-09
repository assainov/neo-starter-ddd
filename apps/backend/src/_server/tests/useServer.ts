import { Application } from 'express';
import { beforeAll } from 'vitest';
import container from '@/container';

type GetAppCallback = () => Application;

export default (): GetAppCallback => {
  let app: Application;

  beforeAll(() => {
    const appServer = container.resolve('appServer');
    appServer.configure();
    app = appServer.app;

    // clean up function, called once after all tests run
    return async () => {
      await container.dispose();
    };
  });

  return () => app;
};
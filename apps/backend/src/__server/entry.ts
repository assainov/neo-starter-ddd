import container from '../container';

const appServer = container.resolve('appServer');

try {
  appServer.start();
} catch (error) {
  console.error(error);
  process.exit(1);
}
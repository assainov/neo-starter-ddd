import container from '../container';

const { httpServer } = container.cradle;

try {
  httpServer.start();
} catch (error) {
  console.error(error);
  process.exit(1);
}
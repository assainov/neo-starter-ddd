import container from './container';

const { server } = container.cradle;

try {
  server.start();
} catch (error) {
  console.error(error);
  process.exit(1);
}
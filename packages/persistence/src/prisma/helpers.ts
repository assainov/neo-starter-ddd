import { exec } from 'node:child_process';
import { promisify } from 'node:util';

// Run latest migrations before all tests
const getSchemaPath = () => `${__dirname}/../../prisma/schema.prisma`;
const execAsync = promisify(exec);
export const runLatestMigrations = async () => {
  await execAsync(`npx prisma db push --schema ${getSchemaPath()}`);
};
import { IDatabase } from './IDatabase';
import { ILogger } from './ILogger';

export type IAppRegistry = {
  logger: ILogger,
  db: IDatabase
}
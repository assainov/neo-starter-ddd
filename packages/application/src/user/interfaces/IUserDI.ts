import { IEncryptionService } from '@neo/domain/user';
import { IAppRegistry } from '../../interfaces';
import { ITokenService } from '@neo/domain/refresh-token';

export type IUserDI = {
  encryptionService: IEncryptionService,
  tokenService: ITokenService
} & IAppRegistry;
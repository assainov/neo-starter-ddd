import { IEncryptionService, ITokenService } from '@neo/domain/user';
import { IAppRegistry } from '../../interfaces';

export type IUserDI = {
  encryptionService: IEncryptionService,
  tokenService: ITokenService
} & IAppRegistry;
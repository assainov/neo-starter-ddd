import bcrypt from 'bcryptjs';
import { IEncryptionService } from './IEncryptionService';

export class EncryptionService implements IEncryptionService {
  public async hashPassword(password: string) {
    if (!password) {
      throw new Error('password cannot be empty');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  public async comparePassword(password: string, passwordHash: string) {
    if (!password || !passwordHash) {
      throw new Error('password and passwordHash cannot be empty');
    }

    const passwordMatches = await bcrypt.compare(password, passwordHash);

    return passwordMatches;
  }
}
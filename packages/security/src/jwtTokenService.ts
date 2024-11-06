import { ITokenService, TokenPayload } from '@neo/domain/user';
import jwt from 'jsonwebtoken';

class JwtTokenService implements ITokenService {
  private secret: string;

  public constructor({ envConfig }: {envConfig: { JWT_SECRET: string }}) {
    if (!envConfig.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set');
    }

    this.secret = envConfig.JWT_SECRET;
  }
  public generateToken(payload: TokenPayload): string {
    if (!payload.email) {
      throw new Error('email cannot be empty');
    }

    const token = jwt.sign(payload, this.secret, { expiresIn: '24h' });

    return token;
  }
}

export default JwtTokenService;
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AuthPayload } from '../interfaces';
import { JWT_CONSTANTS } from '../constants/jwt';

export class JwtService {
  sign(payload: AuthPayload, expiresIn: string | number = env.JWT_EXPIRES_IN): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiresIn as any });
  }

  verify(token: string): AuthPayload {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  }

  extractTokenFromHeader(header?: string): string | null {
    if (!header) return null;
    if (header.startsWith(JWT_CONSTANTS.TOKEN_PREFIX)) {
      return header.slice(JWT_CONSTANTS.TOKEN_PREFIX.length);
    }
    return null;
  }
}

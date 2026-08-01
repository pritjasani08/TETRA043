import { User } from '../../core/interfaces';

export class AuthMapper {
  static toAuthResponse(user: User & { passwordHash?: string }): Omit<User, 'passwordHash'> {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

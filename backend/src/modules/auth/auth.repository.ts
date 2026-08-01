import { SignupDto } from './auth.types';
import { User } from '../../core/interfaces';
import crypto from 'crypto';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null>;
  findUserById(id: string): Promise<User | null>;
  createUser(dto: SignupDto & { passwordHash: string }): Promise<User>;
}

export class MockAuthRepository implements IAuthRepository {
  // Mocked in-memory store since database schema is not finalized yet
  private users: (User & { passwordHash: string })[] = [
    {
      id: crypto.randomUUID(),
      email: 'demo@agrishield.in',
      firstName: 'Demo',
      lastName: 'Farmer',
      passwordHash: '$2b$10$vtmK1XyHBMVo0pu0zb1n8O3hxg8OauT6O1g6/q3Hgk1RG6ejB6cn2', // demo1234
      role: 'admin',
      createdAt: new Date(),
    }
  ];

  async findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async createUser(dto: SignupDto & { passwordHash: string }): Promise<User> {
    const newUser = {
      id: crypto.randomUUID(),
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: dto.passwordHash,
      role: 'user',
      createdAt: new Date(),
    };
    
    this.users.push(newUser);
    
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }
}

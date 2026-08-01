import { IAuthRepository } from './auth.repository';
import { SignupDto } from './auth.types';
import { User } from '../../core/interfaces';
import { pool } from '../../database/pool';

export class SqlAuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const query = `
      SELECT id, email, first_name AS "firstName", last_name AS "lastName", role, created_at AS "createdAt", password_hash AS "passwordHash"
      FROM users
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findUserById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, first_name AS "firstName", last_name AS "lastName", role, created_at AS "createdAt"
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async createUser(dto: SignupDto & { passwordHash: string }): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name AS "firstName", last_name AS "lastName", role, created_at AS "createdAt"
    `;
    const result = await pool.query(query, [
      dto.email,
      dto.passwordHash,
      dto.firstName,
      dto.lastName,
      'user'
    ]);
    return result.rows[0];
  }
}

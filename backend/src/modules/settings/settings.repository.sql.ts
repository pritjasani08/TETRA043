import { ISettingsRepository } from './settings.repository';
import { RawSettingsEntity, UpdateSettingsDto } from './settings.types';
import { query } from '../../database';
import { ApiError } from '../../core/utils/ApiError';

export class SqlSettingsRepository implements ISettingsRepository {
  async getSettings(userId: string): Promise<RawSettingsEntity | null> {
    const text = 'SELECT * FROM user_settings WHERE user_id = $1';
    const result = await query(text, [userId]);
    return result.rows[0] || null;
  }

  async updateSettings(userId: string, data: UpdateSettingsDto): Promise<RawSettingsEntity> {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      const current = await this.getSettings(userId);
      if (!current) throw new ApiError(404, 'Settings not found');
      return current;
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        setClauses.push(`${snakeKey} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      const current = await this.getSettings(userId);
      if (!current) throw new ApiError(404, 'Settings not found');
      return current;
    }

    setClauses.push(`updated_at = $${idx}`);
    values.push(new Date());
    idx++;

    values.push(userId);
    
    const text = `
      UPDATE user_settings
      SET ${setClauses.join(', ')}
      WHERE user_id = $${idx}
      RETURNING *
    `;

    const result = await query(text, values);
    if (!result.rows[0]) {
      throw new ApiError(404, 'Settings not found for update');
    }

    return result.rows[0];
  }

  async createDefaultSettings(userId: string): Promise<RawSettingsEntity> {
    const text = `
      INSERT INTO user_settings (user_id)
      VALUES ($1)
      RETURNING *
    `;
    const result = await query(text, [userId]);
    return result.rows[0];
  }
}

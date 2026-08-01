import { IProfileRepository } from './profile.repository';
import { RawProfileEntity, UpdateProfileDto } from './profile.types';
import { pool } from '../../database/pool';

export class SqlProfileRepository implements IProfileRepository {
  async getProfile(userId: string): Promise<RawProfileEntity | null> {
    const query = `
      SELECT id, email, first_name, last_name, role, phone, village, district, state, farm_name, farm_size, primary_crop, profile_image_url, created_at
      FROM users
      WHERE id = $1
    `;
    const res = await pool.query(query, [userId]);
    if (res.rows.length === 0) return null;
    return res.rows[0] as RawProfileEntity;
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<RawProfileEntity | null> {
    // Generate partial update query dynamically based on supplied fields
    const fields: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    // Field mapping
    const mapping: Record<keyof UpdateProfileDto, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      village: 'village',
      district: 'district',
      state: 'state',
      farmName: 'farm_name',
      farmSize: 'farm_size',
      primaryCrop: 'primary_crop',
      profileImageUrl: 'profile_image_url',
    };

    for (const [key, dbCol] of Object.entries(mapping)) {
      if (data[key as keyof UpdateProfileDto] !== undefined) {
        fields.push(`${dbCol} = $${queryIndex}`);
        values.push(data[key as keyof UpdateProfileDto]);
        queryIndex++;
      }
    }

    if (fields.length === 0) {
      // Nothing to update, just return current profile
      return this.getProfile(userId);
    }

    values.push(userId);
    const updateQuery = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${queryIndex}
      RETURNING id, email, first_name, last_name, role, phone, village, district, state, farm_name, farm_size, primary_crop, profile_image_url, created_at
    `;

    const res = await pool.query(updateQuery, values);
    if (res.rows.length === 0) return null;
    return res.rows[0] as RawProfileEntity;
  }
}

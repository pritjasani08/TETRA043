import { IProfileRepository } from './profile.repository';
import { RawProfileEntity, UpdateProfileDto } from './profile.types';

export class MockProfileRepository implements IProfileRepository {
  private profiles: Map<string, RawProfileEntity> = new Map([
    ['50446c8f-1ab1-4bcf-b4bf-f3558d70c3ba', {
      id: '50446c8f-1ab1-4bcf-b4bf-f3558d70c3ba',
      email: 'demo@agrishield.in',
      first_name: 'Demo',
      last_name: 'Farmer',
      role: 'admin',
      phone: null,
      village: null,
      district: null,
      state: null,
      farm_name: null,
      farm_size: null,
      primary_crop: null,
      profile_image_url: null,
      created_at: new Date('2023-01-01T00:00:00Z'),
    }]
  ]);

  async getProfile(userId: string): Promise<RawProfileEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.profiles.get(userId) || null;
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<RawProfileEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    const current = this.profiles.get(userId);
    if (!current) return null;

    const updated: RawProfileEntity = {
      ...current,
      first_name: data.firstName !== undefined ? data.firstName : current.first_name,
      last_name: data.lastName !== undefined ? data.lastName : current.last_name,
      phone: data.phone !== undefined ? (data.phone || null) : current.phone,
      village: data.village !== undefined ? (data.village || null) : current.village,
      district: data.district !== undefined ? (data.district || null) : current.district,
      state: data.state !== undefined ? (data.state || null) : current.state,
      farm_name: data.farmName !== undefined ? (data.farmName || null) : current.farm_name,
      farm_size: data.farmSize !== undefined ? (data.farmSize || null) : current.farm_size,
      primary_crop: data.primaryCrop !== undefined ? (data.primaryCrop || null) : current.primary_crop,
      profile_image_url: data.profileImageUrl !== undefined ? (data.profileImageUrl || null) : current.profile_image_url,
    };

    this.profiles.set(userId, updated);
    return updated;
  }
}

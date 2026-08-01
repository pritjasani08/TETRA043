import { RawProfileEntity, ProfileDto } from './profile.types';

export class ProfileMapper {
  static toDto(raw: RawProfileEntity): ProfileDto {
    return {
      id: raw.id,
      email: raw.email,
      firstName: raw.first_name,
      lastName: raw.last_name,
      role: raw.role,
      phone: raw.phone || undefined,
      village: raw.village || undefined,
      district: raw.district || undefined,
      state: raw.state || undefined,
      farmName: raw.farm_name || undefined,
      farmSize: raw.farm_size ? Number(raw.farm_size) : undefined,
      primaryCrop: raw.primary_crop || undefined,
      profileImageUrl: raw.profile_image_url || undefined,
      createdAt: raw.created_at.toISOString(),
    };
  }
}

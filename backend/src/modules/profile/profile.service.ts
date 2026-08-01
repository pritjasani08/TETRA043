import { IProfileRepository } from './profile.repository';
import { ProfileDto, UpdateProfileDto } from './profile.types';
import { ProfileMapper } from './profile.mapper';
import { ApiError } from '../../core/utils/ApiError';

export class ProfileService {
  constructor(private readonly repository: IProfileRepository) {}

  async getProfile(userId: string): Promise<ProfileDto> {
    const rawProfile = await this.repository.getProfile(userId);
    if (!rawProfile) {
      throw new ApiError(404, 'Profile not found');
    }
    return ProfileMapper.toDto(rawProfile);
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<ProfileDto> {
    const updatedProfile = await this.repository.updateProfile(userId, data);
    if (!updatedProfile) {
      throw new ApiError(404, 'Profile not found or could not be updated');
    }
    return ProfileMapper.toDto(updatedProfile);
  }
}

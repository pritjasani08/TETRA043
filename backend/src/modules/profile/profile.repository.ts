import { RawProfileEntity, UpdateProfileDto } from './profile.types';

export interface IProfileRepository {
  getProfile(userId: string): Promise<RawProfileEntity | null>;
  updateProfile(userId: string, data: UpdateProfileDto): Promise<RawProfileEntity | null>;
}

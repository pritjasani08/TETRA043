import { RawSettingsEntity, UpdateSettingsDto } from './settings.types';

export interface ISettingsRepository {
  getSettings(userId: string): Promise<RawSettingsEntity | null>;
  updateSettings(userId: string, data: UpdateSettingsDto): Promise<RawSettingsEntity>;
  createDefaultSettings(userId: string): Promise<RawSettingsEntity>;
}

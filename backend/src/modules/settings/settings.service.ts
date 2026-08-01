import { ISettingsRepository } from './settings.repository';
import { SettingsDto, UpdateSettingsDto } from './settings.types';
import { SettingsMapper } from './settings.mapper';

export class SettingsService {
  constructor(private readonly repository: ISettingsRepository) {}

  async getSettings(userId: string): Promise<SettingsDto> {
    let settings = await this.repository.getSettings(userId);
    
    // Defensive fallback: create if not exists
    if (!settings) {
      settings = await this.repository.createDefaultSettings(userId);
    }
    
    return SettingsMapper.toDto(settings);
  }

  async updateSettings(userId: string, data: UpdateSettingsDto): Promise<SettingsDto> {
    let current = await this.repository.getSettings(userId);
    
    // Defensive fallback
    if (!current) {
      await this.repository.createDefaultSettings(userId);
    }

    const updated = await this.repository.updateSettings(userId, data);
    return SettingsMapper.toDto(updated);
  }

  async createDefaultSettings(userId: string): Promise<SettingsDto> {
    const existing = await this.repository.getSettings(userId);
    if (existing) {
      return SettingsMapper.toDto(existing);
    }
    
    const settings = await this.repository.createDefaultSettings(userId);
    return SettingsMapper.toDto(settings);
  }
}

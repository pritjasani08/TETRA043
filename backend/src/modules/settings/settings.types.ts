export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'ta'; // Sample languages
export type VoiceLanguage = 'en' | 'hi' | 'mr' | 'te' | 'ta';

export interface RawSettingsEntity {
  id: string;
  user_id: string;
  language: string;
  notification_enabled: boolean;
  voice_alert_enabled: boolean;
  voice_language: string;
  alert_volume: number;
  security_system_enabled: boolean;
  theme: string;
  created_at: Date;
  updated_at: Date;
}

export interface SettingsDto {
  id: string;
  userId: string;
  language: Language;
  notificationEnabled: boolean;
  voiceAlertEnabled: boolean;
  voiceLanguage: VoiceLanguage;
  alertVolume: number;
  securitySystemEnabled: boolean;
  theme: Theme;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSettingsDto {
  language?: Language;
  notificationEnabled?: boolean;
  voiceAlertEnabled?: boolean;
  voiceLanguage?: VoiceLanguage;
  alertVolume?: number;
  securitySystemEnabled?: boolean;
  theme?: Theme;
}

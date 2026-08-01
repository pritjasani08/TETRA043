export interface RawProfileEntity {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  farm_name: string | null;
  farm_size: number | null;
  primary_crop: string | null;
  profile_image_url: string | null;
  created_at: Date;
}

export interface ProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  farmName?: string;
  farmSize?: number;
  primaryCrop?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  farmName?: string;
  farmSize?: number;
  primaryCrop?: string;
  profileImageUrl?: string;
}

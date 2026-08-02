import { ApiClient } from '../lib/api';

export class AuthService {
  static async login(credentials: { email?: string; mobile?: string; password: string }) {
    return ApiClient.post<{ user: any; token: string }>('/auth/login', credentials);
  }

  static async signup(data: any) {
    return ApiClient.post<{ user: any; token: string }>('/auth/register', data);
  }

  static async me() {
    return ApiClient.get<any>('/auth/me');
  }

  static async logout() {
    return ApiClient.post<any>('/auth/logout', {});
  }

  static async updateProfile(data: any) {
    return ApiClient.put<{ data: any }>('/auth/profile', data);
  }
}

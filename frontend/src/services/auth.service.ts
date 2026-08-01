import { ApiClient } from '../lib/api';

export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    return ApiClient.post<{ user: any; token: string }>('/auth/login', credentials);
  }

  static async signup(data: any) {
    return ApiClient.post<{ user: any; token: string }>('/auth/signup', data);
  }

  static async me() {
    return ApiClient.get<{ id: string; email: string }>('/auth/me');
  }

  static async logout() {
    return ApiClient.post('/auth/logout', {});
  }
}

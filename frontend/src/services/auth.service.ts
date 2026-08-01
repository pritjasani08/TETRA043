import { ApiClient } from '../lib/api';

export class AuthService {
  static async login(credentials: { email?: string; mobile?: string; password: string }) {
    // Mock login for UI development since DB is not ready
    return new Promise<{ user: any; token: string }>((resolve) => {
      setTimeout(() => {
        resolve({ user: { id: "1", name: "Rameshbhai", phone: credentials.mobile || "98250 41122" }, token: "demo-token-123" });
      }, 800);
    });
  }

  static async signup(data: any) {
    return new Promise<{ user: any; token: string }>((resolve) => {
      setTimeout(() => {
        resolve({ user: { id: "1", name: "Rameshbhai", phone: "98250 41122" }, token: "demo-token-123" });
      }, 800);
    });
  }

  static async me() {
    return new Promise<{ id: string; name: string }>((resolve) => {
      setTimeout(() => {
        resolve({ id: "1", name: "Rameshbhai" });
      }, 300);
    });
  }

  static async logout() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  }
}

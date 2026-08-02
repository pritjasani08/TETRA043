import { ApiClient } from "../lib/api";

export class AuthService {
  static get useMocks() {
    return import.meta.env.VITE_USE_MOCKS === "true";
  }

  static async login(credentials: { email?: string; mobile?: string; password: string }) {
    if (this.useMocks) {
      return new Promise<{ user: any; token: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            user: { id: "1", name: "Rameshbhai", phone: credentials.mobile || "98250 41122" },
            token: "demo-token-123",
          });
        }, 800);
      });
    }
    return ApiClient.post<{ user: any; token: string }>("/auth/login", credentials);
  }

  static async signup(data: any) {
    if (this.useMocks) {
      return new Promise<{ user: any; token: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            user: { id: "1", name: "Rameshbhai", phone: "98250 41122" },
            token: "demo-token-123",
          });
        }, 800);
      });
    }
    return ApiClient.post<{ user: any; token: string }>("/auth/signup", data);
  }

  static async me() {
    if (this.useMocks) {
      return new Promise<{ id: string; name: string }>((resolve) => {
        setTimeout(() => {
          resolve({ id: "1", name: "Rameshbhai" });
        }, 300);
      });
    }
    // Expected response format from backend is { user: UserDto }
    const res = await ApiClient.get<{ user: any }>("/auth/me");
    return res.user;
  }

  static async logout() {
    if (this.useMocks) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 300);
      });
    }
    return ApiClient.post<{ success: boolean }>("/auth/logout", {});
  }
}

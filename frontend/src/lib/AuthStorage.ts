export class AuthStorage {
  private static readonly TOKEN_KEY = "agrishield_token";

  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static clearToken(): void {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}

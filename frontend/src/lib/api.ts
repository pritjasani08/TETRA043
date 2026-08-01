import { AuthStorage } from './AuthStorage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export class ApiClient {
  static async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = AuthStorage.getToken();
    
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Automatically set Content-Type to JSON if not sending FormData
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data; // Assuming standardized ApiResponse wrapper
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, body: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }
}

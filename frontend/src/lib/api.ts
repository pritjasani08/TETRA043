import { AuthStorage } from './AuthStorage';
import { ANIMALS, DAILY_TREND, WEEKLY_ACTIVITY, MONTHLY_ACTIVITY, RECENT_ALERTS, PEAK_HOURS } from './agrishield-data';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export class ApiClient {
  static async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = AuthStorage.getToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.warn(`[ApiClient] Failed to fetch ${endpoint}, falling back to mock data.`);
      
      // MOCK DATA FALLBACK ROUTING
      if (endpoint.includes('/dashboard/summary')) {
        return {
          systemStatus: { state: "Secured", cameraStatus: "All Systems Normal", lastUpdated: "Just now" },
          metrics: [],
          charts: {
            dailyTrend: { labels: DAILY_TREND.map(d => d.day), series: DAILY_TREND.map(d => d.intrusions) },
            weeklyTrend: { labels: WEEKLY_ACTIVITY.map(d => d.week), series: WEEKLY_ACTIVITY.map(d => d.intrusions) },
            monthlyTrend: { labels: MONTHLY_ACTIVITY.map(d => d.month), series: MONTHLY_ACTIVITY.map(d => d.intrusions) },
            animalDistribution: ANIMALS.map(a => ({ species: a.name, value: a.today }))
          },
          peakDetectionHours: "2 AM - 4 AM",
          recentAlerts: RECENT_ALERTS.map(a => ({ id: a.id, time: a.time, description: `Detected ${a.animal}`, level: "Warning" })),
          quickActions: []
        } as any;
      }
      
      if (endpoint.includes('/analytics/summary')) {
        return {
          dailyTrend: { labels: DAILY_TREND.map(d => d.day), series: DAILY_TREND.map(d => d.intrusions) },
          weeklyTrend: { labels: WEEKLY_ACTIVITY.map(d => d.week), series: WEEKLY_ACTIVITY.map(d => d.intrusions) },
          monthlyTrend: { labels: MONTHLY_ACTIVITY.map(d => d.month), series: MONTHLY_ACTIVITY.map(d => d.intrusions) },
          animalDistribution: ANIMALS.map(a => ({ label: a.name, value: a.today })),
          confidenceDistribution: [
            { bracket: "90-100%", count: 145 },
            { bracket: "80-89%", count: 89 },
            { bracket: "70-79%", count: 34 }
          ],
          peakDetectionHours: [
            { hourRange: "02:00-03:00", intensity: "High" },
            { hourRange: "03:00-04:00", intensity: "High" },
            { hourRange: "19:00-20:00", intensity: "Medium" }
          ]
        } as any;
      }

      if (endpoint.includes('/auth/me')) {
        return { id: "test-user", name: "Guest User" } as any;
      }

      if (endpoint.includes('/community')) {
        return [
          { id: '1', user: 'Farmer John', message: 'Wild boars spotted near north fence.', time: '2h ago', likes: 12 },
          { id: '2', user: 'AgriTech Admin', message: 'System update scheduled for tonight.', time: '5h ago', likes: 45 }
        ] as any;
      }

      // Default mock fallback
      return [] as any;
    }
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

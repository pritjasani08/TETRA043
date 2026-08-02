import { ApiClient } from '../lib/api';

export interface CommunityPost {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  animal: string;
  distance: string;
  severity: string;
  direction: string;
  eta: string;
  created_at: string;
  author: {
    name: string;
    role: string;
  };
}

export interface CommunityStats {
  totalFarmers: number;
  todayAlerts: number;
}

export const CommunityService = {
  getPosts: async (): Promise<CommunityPost[]> => {
    const data = await ApiClient.get('/community/posts') as CommunityPost[];
    return data;
  },
  
  getStats: async (): Promise<CommunityStats> => {
    const data = await ApiClient.get('/community/stats') as CommunityStats;
    return data;
  }
};

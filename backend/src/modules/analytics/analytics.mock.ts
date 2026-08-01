import { RawAnalyticsEntity } from './analytics.types';

export const MOCK_ANALYTICS_DATA: RawAnalyticsEntity = {
  totalDetections: 1245,
  unresolvedAlerts: 12,
  criticalIncidents: 3,
  trends: {
    daily: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      data: [5, 12, 35, 18, 42, 21],
    },
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [85, 110, 92, 145, 160, 98, 120],
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [350, 420, 280, 510],
    },
  },
  animalDistribution: [
    { category: 'BOAR', count: 450 },
    { category: 'ELEPHANT', count: 85 },
    { category: 'DEER', count: 320 },
    { category: 'MONKEY', count: 390 },
  ],
  confidenceDistribution: [
    { category: '90-100%', count: 850 },
    { category: '80-89%', count: 250 },
    { category: '70-79%', count: 100 },
    { category: '<70%', count: 45 },
  ],
  peakHours: [
    '02:00-03:00',
    '18:00-19:00',
    '23:00-00:00',
  ],
};

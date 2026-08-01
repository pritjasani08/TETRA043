import { RawDashboardEntity } from './dashboard.types';

export const MOCK_DASHBOARD_DATA: RawDashboardEntity = {
  stats: {
    todayCount: 12,
    totalAnimals: 145,
    activeAlerts: 3,
    systemHealthScore: 98,
    riskLevel: 'Low',
  },
  systemStatus: {
    status: 'Armed',
    activeCameras: 4,
    totalCameras: 5,
    lastSync: new Date(),
  },
  trends: {
    daily: {
      timeLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      dataPoints: [0, 2, 5, 1, 8, 4],
    },
    weekly: {
      timeLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      dataPoints: [10, 15, 8, 22, 30, 12, 18],
    },
    monthly: {
      timeLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      dataPoints: [45, 60, 30, 80],
    },
  },
  distribution: [
    { species: 'Wild Boar', count: 65 },
    { species: 'Elephant', count: 12 },
    { species: 'Deer', count: 40 },
    { species: 'Monkey', count: 28 },
  ],
  peakHours: '18:00 - 22:00',
  recentAlerts: [
    {
      id: 'alert-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      message: 'Multiple wild boars detected at North Fence',
      severity: 'Critical',
    },
    {
      id: 'alert-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      message: 'Camera 3 connection lost briefly',
      severity: 'Warning',
    },
    {
      id: 'alert-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      message: 'Deer herd moving away from West boundary',
      severity: 'Info',
    },
  ],
};

// ==========================================
// Raw Database Entities
// ==========================================

export interface RawDetectionStats {
  todayCount: number;
  totalAnimals: number;
  activeAlerts: number;
  systemHealthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface RawSystemStatus {
  status: 'Armed' | 'Disarmed' | 'Maintenance';
  activeCameras: number;
  totalCameras: number;
  lastSync: Date;
}

export interface RawChartData {
  timeLabels: string[];
  dataPoints: number[];
}

export interface RawDistribution {
  species: string;
  count: number;
}

export interface RawAlert {
  id: string;
  timestamp: Date;
  message: string;
  severity: 'Warning' | 'Critical' | 'Info';
}

export interface RawDashboardEntity {
  stats: RawDetectionStats;
  systemStatus: RawSystemStatus;
  trends: {
    daily: RawChartData;
    weekly: RawChartData;
    monthly: RawChartData;
  };
  distribution: RawDistribution[];
  peakHours: string;
  recentAlerts: RawAlert[];
}

import { MetricCardDto, ChartDataDto, QuickActionDto } from '../../core/interfaces';

// ==========================================
// Data Transfer Objects (DTOs)
// ==========================================

export interface SystemStatusDto {
  state: string;
  cameraStatus: string;
  lastUpdated: string;
}

export interface AlertDto {
  id: string;
  time: string;
  description: string;
  level: string;
}

export interface DashboardSummaryDto {
  systemStatus: SystemStatusDto;
  metrics: MetricCardDto[];
  charts: {
    dailyTrend: ChartDataDto;
    weeklyTrend: ChartDataDto;
    monthlyTrend: ChartDataDto;
    animalDistribution: { species: string; value: number }[];
  };
  peakDetectionHours: string;
  recentAlerts: AlertDto[];
  quickActions: QuickActionDto[];
}

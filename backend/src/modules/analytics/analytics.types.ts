import { ChartDataDto } from '../../core/interfaces';

// ==========================================
// Raw Database Entities
// ==========================================

export interface RawDistribution {
  category: string;
  count: number;
}

export interface RawChartData {
  labels: string[];
  data: number[];
}

export interface RawAnalyticsEntity {
  totalDetections: number;
  unresolvedAlerts: number;
  criticalIncidents: number;
  trends: {
    daily: RawChartData;
    weekly: RawChartData;
    monthly: RawChartData;
  };
  animalDistribution: RawDistribution[];
  confidenceDistribution: RawDistribution[];
  peakHours: string[];
}

// ==========================================
// Data Transfer Objects (DTOs)
// ==========================================

export interface TrendChartDto extends ChartDataDto {}

export interface DistributionChartDto {
  label: string;
  value: number;
}

export interface ConfidenceDistributionDto {
  bracket: string;
  count: number;
}

export interface PeakDetectionHourDto {
  hourRange: string;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface SecurityScoreDto {
  score: number;
  status: 'Critical' | 'Warning' | 'Healthy';
  trend: 'Up' | 'Down' | 'Stable';
}

export interface AnalyticsSummaryDto {
  totalDetections: number;
  securityScore: SecurityScoreDto;
  dailyTrend: TrendChartDto;
  weeklyTrend: TrendChartDto;
  monthlyTrend: TrendChartDto;
  animalDistribution: DistributionChartDto[];
  confidenceDistribution: ConfidenceDistributionDto[];
  peakDetectionHours: PeakDetectionHourDto[];
}

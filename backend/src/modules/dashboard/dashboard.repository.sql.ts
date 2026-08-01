import { IDashboardRepository } from './dashboard.repository';
import { RawDashboardEntity, RawDetectionStats, RawSystemStatus, RawDistribution, RawAlert, RawChartData } from './dashboard.types';
import { pool } from '../../database/pool';

export class SqlDashboardRepository implements IDashboardRepository {
  async getDashboardData(): Promise<RawDashboardEntity> {
    const client = await pool.connect();
    
    try {
      // 1. Stats
      const todayCountQuery = `SELECT COUNT(*) FROM detections WHERE created_at >= CURRENT_DATE`;
      const totalAnimalsQuery = `SELECT COUNT(*) FROM detections`;
      const activeAlertsQuery = `SELECT COUNT(*) FROM alerts WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'`;
      
      const [todayCountRes, totalAnimalsRes, activeAlertsRes] = await Promise.all([
        client.query(todayCountQuery),
        client.query(totalAnimalsQuery),
        client.query(activeAlertsQuery)
      ]);
      
      const stats: RawDetectionStats = {
        todayCount: parseInt(todayCountRes.rows[0].count, 10),
        totalAnimals: parseInt(totalAnimalsRes.rows[0].count, 10),
        activeAlerts: parseInt(activeAlertsRes.rows[0].count, 10),
        systemHealthScore: 98, // Hardcoded for now until we have health tables
        riskLevel: 'Low' // Will be calculated based on recent detections
      };

      // Calculate dynamic risk level based on today's high/critical alerts
      const highRiskQuery = `SELECT COUNT(*) FROM detections WHERE created_at >= CURRENT_DATE AND risk_level IN ('HIGH', 'CRITICAL')`;
      const highRiskRes = await client.query(highRiskQuery);
      const highRiskCount = parseInt(highRiskRes.rows[0].count, 10);
      if (highRiskCount > 5) stats.riskLevel = 'Critical';
      else if (highRiskCount > 2) stats.riskLevel = 'High';
      else if (highRiskCount > 0) stats.riskLevel = 'Medium';
      else stats.riskLevel = 'Low';

      // 2. System Status
      const systemStatus: RawSystemStatus = {
        status: 'Armed',
        activeCameras: 4,
        totalCameras: 5,
        lastSync: new Date()
      };

      // 3. Trends (Daily, Weekly, Monthly)
      // Daily: Last 24 hours, grouped by 4-hour buckets
      // For simplicity in this sprint, we'll return zeroes if no data, or a flat array.
      // A more complete implementation would use generate_series.
      // We will provide a simplified query that gets counts for the last 6 days.
      const dailyQuery = `
        SELECT to_char(created_at, 'HH24:00') as time_label, COUNT(*) as count 
        FROM detections 
        WHERE created_at >= NOW() - INTERVAL '24 hours' 
        GROUP BY time_label 
        ORDER BY time_label
      `;
      const dailyRes = await client.query(dailyQuery);
      const daily: RawChartData = {
        timeLabels: dailyRes.rows.map(r => r.time_label),
        dataPoints: dailyRes.rows.map(r => parseInt(r.count, 10))
      };
      
      // Weekly trend (last 7 days)
      const weeklyQuery = `
        SELECT to_char(created_at, 'Dy') as day_label, COUNT(*) as count 
        FROM detections 
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days' 
        GROUP BY day_label, DATE(created_at)
        ORDER BY DATE(created_at)
      `;
      const weeklyRes = await client.query(weeklyQuery);
      const weekly: RawChartData = {
        timeLabels: weeklyRes.rows.map(r => r.day_label),
        dataPoints: weeklyRes.rows.map(r => parseInt(r.count, 10))
      };

      // Monthly trend (last 4 weeks)
      const monthly: RawChartData = {
        timeLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        dataPoints: [0, 0, 0, stats.todayCount] // Simplified fallback
      };

      // 4. Distribution
      const distributionQuery = `
        SELECT animal_type, COUNT(*) as count 
        FROM detections 
        GROUP BY animal_type
      `;
      const distRes = await client.query(distributionQuery);
      const distribution: RawDistribution[] = distRes.rows.map(r => ({
        species: r.animal_type,
        count: parseInt(r.count, 10)
      }));

      // 5. Recent Alerts
      const alertsQuery = `
        SELECT id, message, severity, created_at 
        FROM alerts 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
      const alertsRes = await client.query(alertsQuery);
      const recentAlerts: RawAlert[] = alertsRes.rows.map(r => ({
        id: r.id,
        timestamp: r.created_at,
        message: r.message,
        severity: r.severity as 'Warning' | 'Critical' | 'Info'
      }));

      return {
        stats,
        systemStatus,
        trends: {
          daily: daily.timeLabels.length ? daily : { timeLabels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"], dataPoints: [0,0,0,0,0,0] },
          weekly: weekly.timeLabels.length ? weekly : { timeLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], dataPoints: [0,0,0,0,0,0,0] },
          monthly
        },
        distribution,
        peakHours: "18:00 - 22:00", // Simplified peak hours logic
        recentAlerts
      };

    } finally {
      client.release();
    }
  }
}

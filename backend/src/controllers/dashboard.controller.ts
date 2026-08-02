import { Request, Response } from 'express';
import { supabase } from '../db';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    
    // Fetch counts and stats using Supabase raw query capabilities or standard select
    const { count: detectionCount } = await supabase
      .from('detections')
      .select('*', { count: 'exact', head: true })
      .eq('farmer_id', user.id);

    const { count: alertCount } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('farmer_id', user.id)
      .eq('status', 'Active');

    res.json({
      success: true,
      data: {
        totalDetections: detectionCount,
        activeAlerts: alertCount,
        systemStatus: 'Online'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('alerts')
      .update({ status: 'Cleared', acknowledged: true })
      .eq('id', id);

    if (error) throw error;
    
    // Notify clients that alert was cleared
    const { getIo } = require('../socket');
    getIo().to('hardware_alerts').emit('alert_cleared', { id });
    
    res.json({ success: true, message: 'Alert cleared successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: detections, error } = await supabase
      .from('detections')
      .select('id, animal_name, confidence, status, created_at, threat_level, side')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const dets = detections || [];

    // Animal distribution
    const animalCounts: Record<string, number> = {};
    dets.forEach(d => {
      const name = d.animal_name || 'Unknown';
      animalCounts[name] = (animalCounts[name] || 0) + 1;
    });
    const animalDistribution = Object.entries(animalCounts).map(([species, value]) => ({ species, value }));

    // Trends
    const dailyCounts: Record<string, number> = {};
    const weeklyCounts: Record<string, number> = {};
    const monthlyCounts: Record<string, number> = {};

    // Grouping for simplicity
    dets.forEach(d => {
      const date = new Date(d.created_at);
      
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;

      const startDate = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil(days / 7);
      const weekLabel = `Week ${weekNumber}`;
      weeklyCounts[weekLabel] = (weeklyCounts[weekLabel] || 0) + 1;

      const month = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    const dailyTrend = {
      labels: Object.keys(dailyCounts).reverse(),
      series: Object.values(dailyCounts).reverse()
    };
    const weeklyTrend = {
      labels: Object.keys(weeklyCounts).slice(0, 4).reverse(),
      series: Object.values(weeklyCounts).slice(0, 4).reverse()
    };
    const monthlyTrend = {
      labels: Object.keys(monthlyCounts).reverse(),
      series: Object.values(monthlyCounts).reverse()
    };

    // Recent Alerts
    const recentAlerts = dets.slice(0, 5).map(d => ({
      id: d.id,
      time: new Date(d.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description: `Detected ${d.animal_name} near ${d.side || 'Perimeter'}`,
      level: d.threat_level || 'Warning',
      animal: d.animal_name,
      side: d.side
    }));

    res.json({
      success: true,
      data: {
        systemStatus: { state: "Secured", cameraStatus: "All Systems Normal", lastUpdated: "Just now" },
        metrics: [],
        charts: {
          dailyTrend,
          weeklyTrend,
          monthlyTrend,
          animalDistribution
        },
        peakDetectionHours: "8 PM - 11 PM",
        recentAlerts,
        quickActions: []
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

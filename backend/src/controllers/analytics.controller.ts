import { Request, Response } from 'express';
import { supabase } from '../db';

export const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Fetch all detections
    const { data: detections, error } = await supabase
      .from('detections')
      .select('animal_name, confidence, status, created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!detections || detections.length === 0) {
      // Return empty format if no data
      res.json({
        success: true,
        data: {
          totalDetections: 0,
          avgConfidence: 0,
          worstThreat: { name: "None", count: 0 },
          worstRegion: { name: "None", count: 0 },
          dailyTrend: { labels: [], series: [] },
          weeklyTrend: { labels: [], series: [] },
          monthlyTrend: { labels: [], series: [] },
          animalDistribution: [],
          confidenceDistribution: [
            { bracket: "90-100%", count: 0 },
            { bracket: "80-89%", count: 0 },
            { bracket: "70-79%", count: 0 },
            { bracket: "0-69%", count: 0 }
          ],
          peakDetectionHours: []
        }
      });
      return;
    }

    const totalDetections = detections.length;

    // Avg confidence
    let sumConfidence = 0;
    detections.forEach(d => {
      sumConfidence += d.confidence || 0;
    });
    const avgConfidence = totalDetections > 0 ? Math.round((sumConfidence / totalDetections) * 100) : 0;

    // Animal distribution & worst threat
    const animalCounts: Record<string, number> = {};
    detections.forEach(d => {
      const name = d.animal_name || 'Unknown';
      animalCounts[name] = (animalCounts[name] || 0) + 1;
    });

    const animalDistribution = Object.entries(animalCounts).map(([label, value]) => ({ label, value }));
    let worstThreatName = "None";
    let worstThreatCount = 0;
    for (const [name, count] of Object.entries(animalCounts)) {
      if (count > worstThreatCount) {
        worstThreatCount = count;
        worstThreatName = name;
      }
    }

    // Confidence distribution
    let c90 = 0, c80 = 0, c70 = 0, cOther = 0;
    detections.forEach(d => {
      const c = (d.confidence || 0) * 100;
      if (c >= 90) c90++;
      else if (c >= 80) c80++;
      else if (c >= 70) c70++;
      else cOther++;
    });
    const confidenceDistribution = [
      { bracket: "90-100%", count: c90 },
      { bracket: "80-89%", count: c80 },
      { bracket: "70-79%", count: c70 },
      { bracket: "0-69%", count: cOther }
    ];

    // Peak hours
    const hourCounts: Record<string, number> = {};
    detections.forEach(d => {
      const date = new Date(d.created_at);
      const h = date.getHours();
      const hourLabel = `${h.toString().padStart(2, '0')}:00-${(h+1).toString().padStart(2, '0')}:00`;
      hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1;
    });
    const peakDetectionHours = Object.entries(hourCounts).map(([hourRange, count]) => ({
      hourRange,
      count,
      intensity: count > 10 ? 'High' : (count > 5 ? 'Medium' : 'Low')
    }));

    // Trends
    // In a real app you'd group by actual date, week, month. 
    // Here we'll do a simple grouping.
    
    // Daily Trend
    const dailyCounts: Record<string, number> = {};
    detections.forEach(d => {
      const date = new Date(d.created_at);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });
    const dailyTrend = {
      labels: Object.keys(dailyCounts),
      series: Object.values(dailyCounts)
    };

    // Weekly Trend (mock week labels for simplicity based on month weeks, or just static weeks mapped to counts)
    // We will just group by 'Week X'
    const weeklyCounts: Record<string, number> = {};
    detections.forEach(d => {
      const date = new Date(d.created_at);
      // simple calculation of week of year
      const startDate = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil(days / 7);
      const label = `Week ${weekNumber}`;
      weeklyCounts[label] = (weeklyCounts[label] || 0) + 1;
    });
    const weeklyTrend = {
      labels: Object.keys(weeklyCounts).slice(-4), // last 4 weeks
      series: Object.values(weeklyCounts).slice(-4)
    };

    // Monthly Trend
    const monthlyCounts: Record<string, number> = {};
    detections.forEach(d => {
      const date = new Date(d.created_at);
      const month = date.toLocaleDateString('en-US', { month: 'short' }); // Jan, Feb
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    const monthlyTrend = {
      labels: Object.keys(monthlyCounts),
      series: Object.values(monthlyCounts)
    };

    res.json({
      success: true,
      data: {
        totalDetections,
        avgConfidence,
        worstThreat: { name: worstThreatName, count: worstThreatCount },
        worstRegion: { name: "Ahmedabad", count: totalDetections }, // Mock region for now as region isn't in detections easily
        dailyTrend,
        weeklyTrend,
        monthlyTrend,
        animalDistribution,
        confidenceDistribution,
        peakDetectionHours
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

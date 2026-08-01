import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, StatCard } from "@/components/shield-ui";
import {
  ANIMALS,
  DAILY_TREND,
  DETECTIONS,
  MONTHLY_ACTIVITY,
  PEAK_HOURS,
  REGIONS,
  WEEKLY_ACTIVITY,
} from "@/lib/agrishield-data";
import { Activity, ShieldCheck, AlertTriangle, MapPin } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Intrusion Analytics — AgriShield AI" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <AnalyticsPage />
    </AuthGuard>
  ),
});

const COLORS = [
  "var(--primary)",
  "var(--warning)",
  "var(--accent)",
  "var(--destructive)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tooltipStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  border: "none",
  borderRadius: "16px",
  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--foreground)",
  padding: "12px 16px",
};

function AnalyticsPage() {
  const avgConfidence = Math.round(
    DETECTIONS.reduce((s, d) => s + d.confidence, 0) / DETECTIONS.length,
  );
  const distribution = ANIMALS.map((a) => ({ name: a.name, value: a.week }));
  const worst = [...ANIMALS].sort((a, b) => b.week - a.week)[0]!;
  const worstRegion = [...REGIONS].sort((a, b) => b.detections - a.detections)[0]!;
  const confidenceBands = [
    { band: "95-100%", count: DETECTIONS.filter((d) => d.confidence >= 95).length },
    {
      band: "90-94%",
      count: DETECTIONS.filter((d) => d.confidence >= 90 && d.confidence < 95).length,
    },
    {
      band: "85-89%",
      count: DETECTIONS.filter((d) => d.confidence >= 85 && d.confidence < 90).length,
    },
    { band: "<85%", count: DETECTIONS.filter((d) => d.confidence < 85).length },
  ];

  return (
    <AppShell title="Intelligence & Analytics" subtitle="Deep-dive into 30-day intrusion patterns across your district">
      <div className="mx-auto max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
        
        {/* Top Stats Overview */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard 
            label="Total Detections" 
            value={DETECTIONS.length * 6} 
            hint="Last 30 days" 
            icon={<Activity className="size-5" />} 
          />
          <StatCard 
            label="System Reliability" 
            value={`${avgConfidence}%`} 
            hint="AgriVision-v3 Confidence" 
            tone="primary" 
            icon={<ShieldCheck className="size-5" />} 
          />
          <StatCard
            label="Highest Risk Threat"
            value={<span className="flex items-center gap-2">{worst.emoji} {worst.name}</span>}
            hint={`${worst.week} detections this week`}
            tone="warning"
            icon={<AlertTriangle className="size-5" />}
          />
          <StatCard
            label="Most Vulnerable Region"
            value={worstRegion.name}
            hint={`${worstRegion.detections} district detections`}
            tone="danger"
            icon={<MapPin className="size-5" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Main Trend Chart */}
          <PanelSection title="Activity Trend" description="Rolling 7-day intrusion count" className="lg:col-span-2 p-6 md:p-8">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DAILY_TREND}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: 500 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: 500 }} dx={-10} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--primary)' }} />
                  <Area type="monotone" dataKey="intrusions" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PanelSection>

          <PanelSection title="Animal Distribution" description="Weekly detection share by species">
            <div className="h-[280px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={distribution} 
                    dataKey="value" 
                    nameKey="name" 
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    cornerRadius={8}
                    stroke="none"
                  >
                    {distribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </PanelSection>

          <PanelSection title="Intervention Success" description="Intrusions vs Successfully Deterred">
            <div className="h-[280px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_ACTIVITY}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                  <Bar dataKey="deterred" name="Successfully Deterred" fill="var(--primary)" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="intrusions" name="Undeterred Intrusions" fill="var(--destructive)" radius={[4, 4, 0, 0]} stackId="a" opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PanelSection>

          <PanelSection title="Seasonal Comparison" description="Monthly activity tracking">
            <div className="h-[280px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_ACTIVITY}>
                  <defs>
                    <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                  <Bar dataKey="intrusions" fill="url(#colorMonth)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PanelSection>

          <PanelSection title="Risk Window" description="Peak detection hours (Highest risk: 8 PM - 10 PM)">
            <div className="h-[280px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PEAK_HOURS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {PEAK_HOURS.map((h, i) => (
                      <Cell key={i} fill={h.count > 18 ? "var(--warning)" : "var(--primary)"} opacity={h.count > 18 ? 1 : 0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PanelSection>
        </div>
      </div>
    </AppShell>
  );
}

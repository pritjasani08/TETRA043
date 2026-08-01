import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  History,
  ShieldCheck,
  AlertTriangle,
  Map,
  Users,
  Settings as SettingsIcon,
  BarChart3,
  Bell,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill } from "@/components/shield-ui";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/lib/app-state";
import { useDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Farm Dashboard — AgriShield AI" }],
  }),
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});

const QUICK_ACTIONS = [
  { to: "/detection", label: "Camera Feed", icon: Camera },
  { to: "/history", label: "History", icon: History },
  { to: "/heatmap", label: "Heatmap", icon: Map },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/community", label: "Community", icon: Users },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function Dashboard() {
  const { systemOn, profile } = useAppState();
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <AppShell title={`${profile.farmName}`} subtitle="Loading dashboard...">
        <div className="grid min-h-[60vh] place-items-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const todayTotal = data.distribution.reduce((s, a) => s + a.value, 0); // Approx
  const weekTotal = data.distribution.reduce((s, a) => s + a.value, 0) * 4; // Approx
  const distribution = data.distribution;
  const DAILY_TREND = data.dailyTrend;
  const WEEKLY_ACTIVITY = data.weeklyActivity;
  const MONTHLY_ACTIVITY = data.monthlyActivity;
  const RECENT_ALERTS = data.recentAlerts;
  // Fallback for UI preservation if peakHours isn't fully mocked yet
  const PEAK_HOURS = [
    { hour: "04", count: 6 },
    { hour: "06", count: 11 },
    { hour: "18", count: 17 },
    { hour: "20", count: 26 },
  ];

  return (
    <AppShell
      title={`Hello, ${profile.fullName.split(' ')[0]}`}
      subtitle="Here is what's happening on your farm today."
      actions={
        <Button asChild size="sm" className="rounded-full px-5 font-medium shadow-sm">
          <Link to="/detection">
            View Cameras
            <ArrowRight className="ml-2 size-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row gap-6">
          {/* Main Status */}
          <div className="panel flex-1 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${statusBg}`}>
                {statusIcon}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Status</p>
                <h2 className={`font-display text-2xl md:text-3xl font-bold ${statusColor}`}>
                  {statusTitle}
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm md:text-base max-w-md">
              {statusDesc}
            </p>
          </div>

          {/* Today's Snapshot */}
          <div className="panel w-full md:w-72 p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Today's Activity</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{todayTotal}</span>
                <span className="text-sm text-muted-foreground">intrusions</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Risk</span>
              <RiskPill level="low" />
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            
            {/* Live Camera Preview */}
            <PanelSection title="Live Camera Preview" right={<span className="flex items-center gap-2 text-xs font-medium text-primary"><span className="size-2 rounded-full bg-primary animate-pulse" /> Live</span>}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-muted/30">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src="/agrishield_boar.png"
                    alt="Farm Feed"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "brightness(0.9) contrast(1.1) saturate(1.2) sepia(0.1)" }}
                  />
                  {/* Clean, simplified overlay instead of military grid */}
                  <div className="absolute top-4 left-4">
                    <div className="backdrop-blur-md bg-white/80 dark:bg-black/60 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm border border-white/20">
                      North Boundary · CAM-01
                    </div>
                  </div>
                </div>
              </div>
            </PanelSection>

            {/* Analytics Simplification */}
            <PanelSection title="Activity Trends" description="Intrusions detected over the last 7 days">
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DAILY_TREND}>
                    <defs>
                      <linearGradient id="colorIntrusions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Area type="monotone" dataKey="intrusions" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIntrusions)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </PanelSection>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            
            {/* Recent Alert - Prominent but friendly */}
            {latestAlert && (
              <div className="panel p-5 border-l-4 border-l-warning">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-warning/15 p-2 text-warning">
                    <Bell className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Recent Activity</h3>
                    <p className="text-sm mt-1 text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">{latestAlert.animal}</strong> was detected near the {latestAlert.side} fence {latestAlert.time}.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <Button variant="outline" size="sm" className="h-8 text-xs rounded-full">View Recording</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations / Assistant */}
            <PanelSection title="Smart Recommendations" className="bg-primary/5 border-primary/10">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <Lightbulb className="size-5 text-primary" />
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-foreground">
                    Based on regional activity, wild boars are highly active between 8 PM and 11 PM.
                  </p>
                  <p className="text-muted-foreground">
                    We recommend verifying your deterrent systems are fully operational on the North and West boundaries before dusk.
                  </p>
                  <Button variant="link" className="px-0 h-auto text-primary font-semibold">
                    Review Deterrent Settings <ArrowRight className="ml-1 size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </PanelSection>

          <PanelSection
            title="Detection overview"
            description="Today and weekly counts per agricultural species"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {distribution.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl border border-border bg-surface/60 p-3.5 transition-all hover:border-primary/40 hover:bg-surface/80"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium text-sm">
                      {a.name}
                    </span>
                    <RiskPill level="medium" />
                  </div>
                  <div className="mt-3.5 flex items-end gap-5">
                    <span>
                      <span className="block font-display text-xl font-bold">{Math.floor(a.value / 4)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        today
                      </span>
                    </span>
                    <span>
                      <span className="block font-display text-xl font-bold text-muted-foreground">
                        {a.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        this week
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </PanelSection>
        </div>

        {/* Right Side: System Logs & Recent Alerts */}
        <div className="flex flex-col gap-6">
          <PanelSection title="Edge Hardware Health" description="Integrated IoT protection stats">
            <div className="relative overflow-hidden rounded-xl border border-border bg-background/55 p-4">
              <ul className="relative space-y-3.5 text-xs">
                {[
                  ["System status", systemOn ? "🟢 Active & Guarding" : "🔴 Paused / Disabled"],
                  ["Camera connection", "Connected · CAM-01 North"],
                  ["Local detection engine", systemOn ? "Running · 24 fps" : "Idle (Switch off)"],
                  ["Active deterrent hardware", systemOn ? "Ready · Strobe Horn Node" : "Disabled"],
                  ["Last sync time", "2 seconds ago"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex items-center justify-between gap-3 pb-2 border-b border-border/40 last:pb-0 last:border-b-0"
                  >
                    <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium">{label}</span>
                  </Link>
                ))}
              </ul>
            </div>
          </PanelSection>

          <PanelSection
            title="Recent alerts"
            description="Latest five detections across Gujarat zones"
            right={
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                <Link to="/history">View all</Link>
              </Button>
            }
          >
            <ul className="divide-y divide-border">
              {RECENT_ALERTS.map((d: any) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-foreground">{d.description || d.message || d.animal}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {d.time || d.timestamp}
                    </span>
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      d.level === "Critical" || d.alert === "Triggered"
                        ? "border-destructive/40 bg-destructive/10 text-destructive text-[10px] font-bold"
                        : "border-border text-muted-foreground text-[10px]"
                    }
                  >
                    {d.level || d.alert}
                  </Badge>
                </li>
              ))}
            </ul>
          </PanelSection>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PanelSection title="Daily detection trend" description="Intrusions per day this week">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_TREND}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                />
                <Area
                  type="monotone"
                  dataKey="intrusions"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelSection>

        <PanelSection title="Weekly activity" description="Intrusions vs successfully deterred">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ACTIVITY}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                />
                <Bar dataKey="intrusions" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="deterred" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelSection>

          </div>
        </div>

      </div>
    </AppShell>
  );
}


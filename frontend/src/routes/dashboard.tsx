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
  CloudSun,
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill } from "@/components/shield-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/lib/app-state";
import { useDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";
import { BarChart, Bar } from "recharts";

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
  { to: "/detection", label: "Live Cameras", icon: Camera },
  { to: "/heatmap", label: "Zone Heatmap", icon: Map },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
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

  const todayTotal = data.distribution.reduce((s: number, a: { value: number }) => s + a.value, 0); // Approx
  const weekTotal =
    data.distribution.reduce((s: number, a: { value: number }) => s + a.value, 0) * 4; // Approx
  const distribution = data.distribution
    .filter((a: any) => !["ELEPHANT"].includes(a.name.toUpperCase()))
    .slice(0, 4);
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

  const latestAlert = RECENT_ALERTS?.[0];
  const statusBg = systemOn ? "bg-primary/15" : "bg-destructive/15";
  const statusIcon = systemOn ? (
    <ShieldCheck className="size-6 text-primary" />
  ) : (
    <AlertTriangle className="size-6 text-destructive" />
  );
  const statusTitle = systemOn ? "System Armed" : "System Offline";
  const statusDesc = systemOn
    ? "All cameras are active and AI is monitoring the perimeter."
    : "Monitoring is paused. AI detections are currently disabled.";
  const statusColor = systemOn ? "text-primary" : "text-destructive";

  return (
    <AppShell
      title={`Good Evening, ${profile.fullName.split(" ")[0]}`}
      subtitle={new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
    >
      <div className="mx-auto max-w-[1200px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        {/* HERO SECTION (Layer 1 - Critical) */}
        <section className="flex flex-col xl:flex-row gap-6">
          {/* Main Status Hero */}
          <div className="panel flex-[2] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden bg-white">
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div
                  className={`p-4 rounded-3xl ${statusBg} shadow-lg shadow-${statusBg}/30 transition-transform hover:scale-105 duration-300`}
                >
                  {statusIcon}
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Farm Status
                  </p>
                  <h2
                    className={`font-display text-4xl md:text-5xl font-bold tracking-tight ${statusColor}`}
                  >
                    {statusTitle}
                  </h2>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 bg-accent/10 px-4 py-2 rounded-2xl border border-accent/20">
                <CloudSun className="size-6 text-accent" />
                <div>
                  <p className="text-sm font-bold text-foreground">24°C, Clear</p>
                  <p className="text-xs text-muted-foreground font-medium">Optimal conditions</p>
                </div>
              </div>
            </div>

            <div className="mt-10 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <p className="text-muted-foreground text-base md:text-lg max-w-lg font-medium leading-relaxed">
                {statusDesc}
              </p>

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-6 font-semibold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
              >
                <Link to="/detection">
                  View Live Feed
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Today's Snapshot (Layer 2) */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="panel p-6 flex-1 flex flex-col justify-center bg-gradient-to-br from-white to-surface-2 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Activity className="size-32" />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Today's Activity
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl font-bold tracking-tighter text-foreground">
                  {todayTotal}
                </span>
                <span className="text-lg font-medium text-muted-foreground">intrusions</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <RiskPill level="low" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Overall Risk Level
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr] items-stretch">
          {/* ROW 1 */}
          {/* Perimeter Vision */}
          <PanelSection
            title="Perimeter Vision"
            className="h-full flex flex-col"
            right={
              <Badge
                variant="outline"
                className="gap-2 border-primary/20 bg-primary/5 text-primary rounded-full px-3 py-1 font-bold"
              >
                <span className="size-2 rounded-full bg-primary animate-pulse" /> Live Analysis
              </Badge>
            }
          >
            <div className="group relative overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-black/5 bg-black mt-2 flex-1 min-h-[240px]">
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src="/agrishield_boar.png"
                  alt="Farm Feed"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-6 left-6">
                  <div className="backdrop-blur-xl bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-white shadow-lg">
                    <p className="text-xs font-bold tracking-wider opacity-80">NORTH BOUNDARY</p>
                    <p className="font-display text-lg font-bold">CAM-01 Edge</p>
                  </div>
                </div>
                {systemOn && (
                  <div className="absolute bottom-6 left-6">
                    <div className="backdrop-blur-xl bg-primary/20 px-4 py-2 rounded-2xl border border-primary/30 text-white flex items-center gap-3 shadow-lg">
                      <ShieldCheck className="size-5" />
                      <div>
                        <p className="text-xs font-bold tracking-wider opacity-80">AI ENGINE</p>
                        <p className="font-semibold text-sm">Actively Scanning • 99% Conf</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PanelSection>

          {/* Premium Activity Trend */}
          <PanelSection
            title="Weekly Trend"
            className="h-full flex flex-col"
            right={
              <Link to="/analytics" className="text-xs font-bold text-primary hover:underline">
                View All
              </Link>
            }
          >
            <div className="flex-1 mt-2 min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DAILY_TREND}>
                  <defs>
                    <linearGradient id="colorIntrusions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                      fontWeight: 600,
                      padding: "12px 16px",
                    }}
                    itemStyle={{ color: "var(--primary)" }}
                  />
                  <Area
                    type="monotoneX"
                    dataKey="intrusions"
                    stroke="var(--primary)"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorIntrusions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PanelSection>

          {/* ROW 2 */}
          {/* Smart Assistant Recommendations */}
          <div className="panel h-full p-6 sm:p-8 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent relative overflow-hidden flex flex-col justify-center">
            <div className="flex gap-5 relative z-10">
              <div className="shrink-0 mt-1">
                <div className="p-3 bg-white rounded-full shadow-sm border border-border text-primary">
                  <Lightbulb className="size-6" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-foreground">
                  AI Farming Assistant
                </h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-2xl">
                  Based on regional data, wild boar activity peaks between 8 PM and 11 PM tonight. I
                  recommend verifying that the deterrent sirens on the North and West boundaries are
                  fully operational before dusk.
                </p>
                <Button
                  variant="link"
                  className="px-0 h-auto text-primary font-bold hover:no-underline hover:opacity-80"
                >
                  Verify Deterrent Settings <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Elegant Distribution Donut */}
          <PanelSection title="Animal Distribution" className="h-full flex flex-col">
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 mt-2">
              <div className="h-32 w-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={6}
                      cornerRadius={8}
                      stroke="none"
                    >
                      {distribution.map((_: any, i: number) => (
                        <Cell
                          key={i}
                          fill={
                            i === 0
                              ? "var(--warning)"
                              : i === 1
                                ? "var(--primary)"
                                : "var(--accent)"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Top Species</h3>
                <p className="text-sm mt-1 text-muted-foreground leading-relaxed">
                  Most of the recent activity has been associated with{" "}
                  {distribution[0]?.name || "Boars"}.
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Button variant="outline" size="sm" className="h-8 text-xs rounded-full" asChild>
                    <Link to="/analytics">View Analytics</Link>
                  </Button>
                </div>
              </div>
            </div>
          </PanelSection>

          {/* ROW 3 */}
          {/* Detection overview */}
          <PanelSection
            title="Detection overview"
            description="Today and weekly counts per agricultural species"
            className="h-full flex flex-col"
          >
            <div className="grid gap-4 sm:grid-cols-2 flex-1">
              {distribution.map((a: any) => (
                <div
                  key={a.name}
                  className="rounded-xl border border-border bg-surface/60 p-4 transition-all hover:border-primary/40 hover:bg-surface/80 flex flex-col justify-between h-full"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="flex items-center gap-2 font-medium text-sm truncate">
                      {a.name}
                    </span>
                    <RiskPill level="medium" />
                  </div>
                  <div className="mt-4 flex items-end gap-5">
                    <span>
                      <span className="block font-display text-xl font-bold">
                        {Math.floor(a.value / 4)}
                      </span>
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

          <PanelSection
            title="Recent alerts"
            description="Latest detections across all zones"
            className="h-full flex flex-col"
            right={
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                <Link to="/history">View all</Link>
              </Button>
            }
          >
            <ul className="flex-1 divide-y divide-border panel px-4 bg-white/50 flex flex-col">
              {RECENT_ALERTS.slice(0, 3).map((d: any) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                  <span className="min-w-0 flex items-center gap-3">
                    <div className="mt-0.5 rounded-full bg-warning/15 p-2 text-warning shrink-0">
                      <Bell className="size-3" />
                    </div>
                    <div>
                      <span className="block truncate font-semibold text-foreground">
                        {d.description || d.message || d.animal}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {d.time || d.timestamp}
                      </span>
                    </div>
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
              {(!RECENT_ALERTS || RECENT_ALERTS.length === 0) && (
                <li className="py-4 text-center text-muted-foreground text-sm">
                  No recent alerts.
                </li>
              )}
            </ul>
          </PanelSection>
        </div>

        {/* Edge Hardware Health (Horizontal at bottom) */}
        {/* Edge Hardware Health (Horizontal at bottom) */}
        <PanelSection title="Edge Hardware Health" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              {
                label: "System status",
                value: systemOn ? "🟢 Active & Guarding" : "🔴 Paused",
                icon: ShieldCheck,
              },
              { label: "Camera connection", value: "Connected · CAM-01", icon: Camera },
              {
                label: "Local detection",
                value: systemOn ? "Running · 24 fps" : "Idle",
                icon: Activity,
              },
              {
                label: "Active deterrent",
                value: systemOn ? "Ready · Horn Node" : "Disabled",
                icon: Bell,
              },
              { label: "Last sync time", value: "2 seconds ago", icon: History },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full justify-between"
                >
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Icon className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              );
            })}
          </div>
        </PanelSection>
      </div>
    </AppShell>
  );
}

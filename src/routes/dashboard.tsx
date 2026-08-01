import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Camera,
  Cctv,
  History,
  Map,
  Radar,
  ShieldAlert,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill, StatCard } from "@/components/shield-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ANIMALS,
  DAILY_TREND,
  MONTHLY_ACTIVITY,
  PEAK_HOURS,
  WEEKLY_ACTIVITY,
  RECENT_ALERTS,
} from "@/lib/agrishield-data";
import { useAppState } from "@/lib/app-state";

import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farm Monitoring Dashboard — AgriShield AI" },
      {
        name: "description",
        content:
          "Live crop protection dashboard: intrusion counts, risk level, animal detection cards, trends and recent alerts.",
      },
      { property: "og:title", content: "Farm Monitoring Dashboard — AgriShield AI" },
      {
        property: "og:description",
        content:
          "Monitor animal intrusions on your farm in real time with AI detection, deterrents and community alerts.",
      },
    ],
  }),
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--success)",
  "var(--warning)",
];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

const QUICK_ACTIONS = [
  { to: "/detection", label: "Animal Detection", icon: Camera },
  { to: "/history", label: "Detection History", icon: History },
  { to: "/heatmap", label: "Heatmap", icon: Map },
  { to: "/analytics", label: "Analysis", icon: BarChart3 },
  { to: "/community", label: "Community", icon: Users },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function Dashboard() {
  const { systemOn, profile } = useAppState();
  const todayTotal = ANIMALS.reduce((s, a) => s + a.today, 0);
  const weekTotal = ANIMALS.reduce((s, a) => s + a.week, 0);
  const distribution = ANIMALS.map((a) => ({ name: a.name, value: a.week }));

  return (
    <AppShell
      title={`${profile.farmName}`}
      subtitle={`${profile.village}, ${profile.district} · ${profile.cropType} · ${profile.farmSize}`}
      actions={
        <Button asChild size="sm">
          <Link to="/detection">
            <Radar className="size-4" />
            Run detection
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="System status"
          value={systemOn ? "Active" : "Disabled"}
          hint={systemOn ? "Detection loop running" : "Enable to resume alerts"}
          tone={systemOn ? "primary" : "danger"}
          icon={<Cctv className="size-4" />}
        />
        <StatCard
          label="Today's intrusions"
          value={todayTotal}
          hint="Across 5 fence zones"
          icon={<ShieldAlert className="size-4" />}
        />
        <StatCard
          label="Active alerts"
          value={systemOn ? 3 : 0}
          hint="Awaiting farmer action"
          tone="warning"
          icon={<AlertTriangle className="size-4" />}
        />
        <StatCard label="Animals detected" value={weekTotal} hint="Last 7 days" />
        <StatCard label="Risk level" value="High" hint="Wild boar activity spike" tone="danger" />
        <div className="panel p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Security score
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-primary">82/100</p>
          <Progress value={82} className="mt-3 h-1.5" />
          <p className="mt-1 text-xs text-muted-foreground">Fence coverage 4/5 zones</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Side: Live Edge Feed (High Visibility) & Detection Overview */}
        <div className="flex flex-col gap-6">
          <PanelSection
            title="Live Edge Camera Feed"
            description="Real-time thermal analytics from fence line CAM-01 (North Zone)"
            right={
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold text-red-400">LIVE DETECTING</span>
              </div>
            }
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
              {/* Thermal video container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                {/* Image */}
                <img
                  src="/agrishield_boar.png"
                  alt="Live Thermal Feed"
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Thermal Bounding Box */}
                {systemOn && (
                  <div className="absolute top-[38%] left-[28%] w-[42%] h-[48%] border-2 border-red-500 rounded-lg pointer-events-none animate-pulse">
                    <div className="absolute -top-6 left-0 bg-red-500 text-white text-[9px] uppercase px-1.5 py-0.5 rounded font-bold tracking-wider font-display">
                      WILD BOAR [97.4%]
                    </div>
                    {/* Bounding box corner ticks */}
                    <span className="absolute -top-[2px] -left-[2px] w-3.5 h-3.5 border-t-2 border-l-2 border-white rounded-tl" />
                    <span className="absolute -top-[2px] -right-[2px] w-3.5 h-3.5 border-t-2 border-r-2 border-white rounded-tr" />
                    <span className="absolute -bottom-[2px] -left-[2px] w-3.5 h-3.5 border-b-2 border-l-2 border-white rounded-bl" />
                    <span className="absolute -bottom-[2px] -right-[2px] w-3.5 h-3.5 border-b-2 border-r-2 border-white rounded-br" />
                  </div>
                )}

                {/* Scanline Sweep Overlay */}
                {systemOn && (
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent scan-line pointer-events-none" />
                )}

                {/* HUD Overlay details */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 text-[9px] font-mono text-white/70 bg-black/60 backdrop-blur-md p-2.5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>REC [CAM-01_NORTH]</span>
                  </div>
                  <div>FPS: 24.2 / LATENCY: 32ms</div>
                  <div>RESOLVED: 1080P</div>
                </div>

                <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 text-[9px] font-mono text-white/70 bg-black/60 backdrop-blur-md p-2.5 rounded-lg border border-white/10 text-right">
                  <div>DETECTION: ACTIVE</div>
                  <div>DETERRENT: SIREN</div>
                  <div>VILLAGE BROADCAST: SYNCED</div>
                </div>

                {/* Simulated overlay lines */}
                <div className="grid-lines absolute inset-0 opacity-25 pointer-events-none" />

                {!systemOn && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                    <Cctv className="size-10 text-muted-foreground mb-3" />
                    <h4 className="font-display font-bold text-base text-muted-foreground">
                      Detection Engine Off
                    </h4>
                    <p className="text-xs text-muted-foreground/80 max-w-xs mt-1.5">
                      Enable the main security system switch to initialize the local camera vision
                      loops.
                    </p>
                  </div>
                )}
              </div>

              {/* Feed Meta Info */}
              <div className="p-4 bg-surface/50 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-5">
                  <span className="text-muted-foreground">
                    Zone: <strong className="text-foreground">North Boundary</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Hardware: <strong className="text-foreground">Edge AI Node-04</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Signal Strength: <strong className="text-primary">94%</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] font-semibold"
                    onClick={() =>
                      toast.success("Manual Siren Deterrent Activated", {
                        description: "Dynamic sirens have been fired at North fence.",
                      })
                    }
                  >
                    Manual Siren
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 text-[11px] font-semibold"
                    onClick={() =>
                      toast.warning("Manual Community Warning Broadcasted", {
                        description: "Nearby farms notified of potential intrusion.",
                      })
                    }
                  >
                    Broadcast Alert
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
              {ANIMALS.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl border border-border bg-surface/60 p-3.5 transition-all hover:border-primary/40 hover:bg-surface/80"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium text-sm">
                      <span className="text-xl">{a.emoji}</span>
                      {a.name}
                    </span>
                    <RiskPill level={a.severity} />
                  </div>
                  <div className="mt-3.5 flex items-end gap-5">
                    <span>
                      <span className="block font-display text-xl font-bold">{a.today}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        today
                      </span>
                    </span>
                    <span>
                      <span className="block font-display text-xl font-bold text-muted-foreground">
                        {a.week}
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
                    <span className="text-muted-foreground font-light">{k}</span>
                    <span className="font-semibold text-foreground">{v}</span>
                  </li>
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
              {RECENT_ALERTS.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-foreground">{d.animal}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {d.time} · {d.side} Fence
                    </span>
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      d.alert === "Triggered"
                        ? "border-destructive/40 bg-destructive/10 text-destructive text-[10px] font-bold"
                        : "border-border text-muted-foreground text-[10px]"
                    }
                  >
                    {d.alert}
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

        <PanelSection title="Monthly activity" description="Six-month intrusion volume">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_ACTIVITY}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="intrusions"
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  fill="var(--chart-5)"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelSection>

        <PanelSection title="Animal distribution" description="Share of weekly detections">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-56 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={44}
                    outerRadius={78}
                    paddingAngle={3}
                  >
                    {distribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: "var(--popover-foreground)" }}
                    labelStyle={{ color: "var(--popover-foreground)" }}
                    cursor={false}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid flex-1 gap-1.5 text-xs">
              {distribution.map((d, i) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="flex-1">{d.name}</span>
                  <span className="text-muted-foreground">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </PanelSection>

        <PanelSection
          title="Peak detection hours"
          description="Intrusions concentrate after dusk"
          className="lg:col-span-2"
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEAK_HOURS}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {PEAK_HOURS.map((h, i) => (
                    <Cell key={i} fill={h.count > 18 ? "var(--destructive)" : "var(--chart-1)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelSection>
      </div>

      <PanelSection title="Quick actions" description="Jump into any module" className="mt-6">
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
            <Button key={to} asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link to={to}>
                <Icon className="size-5 text-primary" />
                <span className="text-xs">{label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </PanelSection>
    </AppShell>
  );
}

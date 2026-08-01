import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Intrusion Analytics — AgriShield AI" },
      {
        name: "description",
        content:
          "KPIs and charts on intrusions per day, animal mix, weekly and monthly comparison, confidence and peak hours.",
      },
      { property: "og:title", content: "Intrusion Analytics — AgriShield AI" },
      {
        property: "og:description",
        content: "Deep-dive analytics on animal intrusion patterns across your farm and district.",
      },
    ],
  }),
  component: () => (
    <AuthGuard>
      <AnalyticsPage />
    </AuthGuard>
  ),
});

const COLORS = [
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
    <AppShell title="Analytics" subtitle="30-day intrusion intelligence for your farm and district">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total detections" value={DETECTIONS.length * 6} hint="Last 30 days" />
        <StatCard label="Active days" value="28 / 30" hint="Monitoring uptime 93%" tone="primary" />
        <StatCard label="Average confidence" value={`${avgConfidence}%`} hint="AgriVision-v3" />
        <StatCard
          label="Most dangerous animal"
          value={`${worst.emoji} ${worst.name}`}
          hint={`${worst.week} detections this week`}
          tone="danger"
        />
        <StatCard
          label="Most dangerous region"
          value={worstRegion.name}
          hint={`${worstRegion.detections} district detections`}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PanelSection title="Intrusions per day" description="Rolling 7-day count">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY_TREND}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="intrusions"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PanelSection>

        <PanelSection title="Animal distribution" description="Weekly detection share">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={80}>
                  {distribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
        </PanelSection>

        <PanelSection title="Weekly comparison" description="Intrusions vs deterred">
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
                <Bar dataKey="intrusions" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="deterred" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelSection>

        <PanelSection title="Monthly comparison" description="Season-long trend">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_ACTIVITY}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="intrusions" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelSection>

        <PanelSection title="Detection confidence" description="Confidence band distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={confidenceBands}
                innerRadius="28%"
                outerRadius="95%"
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="count" cornerRadius={8}>
                  {confidenceBands.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </RadialBar>
                <Tooltip contentStyle={tooltipStyle} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            {confidenceBands.map((b, i) => (
              <li key={b.band} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                {b.band}
                <span className="ml-auto text-muted-foreground">{b.count}</span>
              </li>
            ))}
          </ul>
        </PanelSection>

        <PanelSection title="Peak detection time" description="Highest risk window: 8 PM – 10 PM">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEAK_HOURS}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
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
    </AppShell>
  );
}

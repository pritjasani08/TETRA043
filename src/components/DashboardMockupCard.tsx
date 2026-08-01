import { Sparkles } from "lucide-react";

export interface ProgressMetric {
  label: string;
  value: string;
  percentage: number;
  fromColor: string;
  toColor: string;
}

export interface SparklineData {
  label: string;
  value: string;
  change: string;
  color: string;
  sparkPoints: number[];
}

export interface LiveEvent {
  time: string;
  message: string;
  color: string;
  tag: string;
}

export interface SidebarItem {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  active?: boolean;
}

export interface FloatingChip {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  gradFrom: string;
  gradTo: string;
  xPosClass: string;
  yPosClass: string;
}

export interface BoundingBoxConfig {
  label: string;
  top: string | number;
  left: string | number;
  width: string | number;
  height: string | number;
  colorClass?: string;
  badgeBg?: string;
}

export interface DashboardMockupCardProps {
  roleName: string;
  accentColor: string;
  successScore: number;
  successStatus: string;
  progressMetrics: ProgressMetric[];
  chartTitle: string;
  chartValue: string;
  chartChange: string;
  chartAreaGradId: string;
  chartLineGradId: string;
  chartLinePath: string;
  chartAreaPath: string;
  chartTooltipTime: string;
  chartTooltipValue: string;
  chartTooltipChange: string;
  sparklines: SparklineData[];
  liveEvents: LiveEvent[];
  sidebarItems: SidebarItem[];
  floatingChips: FloatingChip[];
  copilotStatus: string;
  cctvImage?: string;
  boundingBox?: BoundingBoxConfig;
}

export function DashboardMockupCard({
  roleName,
  accentColor,
  successScore,
  successStatus,
  progressMetrics,
  chartTitle,
  chartValue,
  chartChange,
  chartAreaGradId,
  chartLineGradId,
  chartLinePath,
  chartAreaPath,
  chartTooltipTime,
  chartTooltipValue,
  chartTooltipChange,
  sparklines,
  liveEvents,
  sidebarItems,
  floatingChips,
  copilotStatus,
  cctvImage,
  boundingBox,
}: DashboardMockupCardProps) {
  return (
    <div className="relative mx-auto max-w-5xl w-full">
      {/* Dynamic Glow aura behind the card */}
      <div
        className="absolute -inset-x-16 -inset-y-10 -z-10 rounded-[44px] blur-3xl opacity-30 animate-pulse pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
        }}
      />

      {/* Main Dashboard Panel Border */}
      <div
        className="rounded-[20px] p-[1px]"
        style={{
          background: `linear-gradient(140deg, rgba(255,255,255,0.15) 0%, ${accentColor}40 30%, rgba(255,255,255,0.03) 100%)`,
        }}
      >
        <div
          className="overflow-hidden rounded-[19px] bg-[#070913]/95 backdrop-blur-2xl text-white text-left"
          style={{
            boxShadow: `0 45px 100px -25px rgba(0,0,0,0.95), 0 0 50px -10px ${accentColor}44`,
          }}
        >
          {/* Top Browser Bar */}
          <div className="flex items-center gap-2 border-b border-white/5 bg-gradient-to-b from-[#090b16] to-[#05060f] px-4 py-2.5">
            <div className="flex items-center gap-1.5 w-[20%]">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840] shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)]" />
            </div>

            <div className="mx-auto flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              agrishield.ai/dashboard?role={roleName}
            </div>

            <div className="ml-auto flex items-center gap-2 text-[10px] font-mono text-white/40 w-[20%] justify-end">
              <span className="hidden items-center gap-1 md:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                LIVE STREAM
              </span>
            </div>
          </div>

          {/* Grid Layout containing sidebar and content area */}
          <div className="grid grid-cols-12 gap-px bg-white/5">
            {/* Sidebar */}
            <aside className="col-span-2 hidden flex-col gap-1.5 bg-[#05060F] p-3 lg:flex">
              {sidebarItems.map((it, i) => {
                const IconComponent = it.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium transition-colors cursor-pointer ${
                      it.active
                        ? "bg-white/10 text-white"
                        : "text-white/45 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <IconComponent
                      className="h-3.5 w-3.5"
                      style={{ color: it.active ? accentColor : "currentColor" }}
                    />
                    {it.label}
                  </div>
                );
              })}
            </aside>

            {/* Dashboard Content Grid */}
            <div className="col-span-12 grid grid-cols-12 gap-3 bg-[#070913] p-4 lg:col-span-10">
              {/* Radial KPI Gauge Widget */}
              <div className="col-span-12 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 sm:col-span-4 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/45">
                  <span>KPI Score</span>
                  <span style={{ color: accentColor }}>{successStatus}</span>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                      <defs>
                        <linearGradient id={`score-grad-${roleName}`} x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0%" stopColor={accentColor} />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke={`url(#score-grad-${roleName})`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="97"
                        strokeDashoffset={97 - (97 * successScore) / 100}
                        style={{
                          transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-center">
                        <div className="font-sans text-xl font-bold text-white">{successScore}</div>
                        <div className="text-[8px] font-mono uppercase text-white/40">/100</div>
                      </div>
                    </div>
                  </div>

                  {/* Small progress lines inside circular KPI widget */}
                  <div className="flex-1 space-y-1.5">
                    {progressMetrics.map((pm, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-white/60">
                          <span>{pm.label}</span>
                          <span className="font-mono" style={{ color: pm.toColor }}>
                            {pm.value}
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pm.percentage}%`,
                              background: `linear-gradient(to right, ${pm.fromColor}, ${pm.toColor})`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Line Chart or CCTV Feed widget */}
              <div className="col-span-12 sm:col-span-8">
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  {cctvImage ? (
                    /* High-Fidelity CCTV Feed Mode */
                    <div className="relative w-full flex-1 min-h-[170px] rounded-lg overflow-hidden border border-white/10 bg-black/40 group">
                      {/* Bounding Box overlay graphic */}
                      {boundingBox && (
                        <div
                          className={`absolute border-2 rounded-md ${
                            boundingBox.colorClass || "border-red-500 bg-red-500/10"
                          } animate-pulse z-20`}
                          style={{
                            top: boundingBox.top,
                            left: boundingBox.left,
                            width: boundingBox.width,
                            height: boundingBox.height,
                          }}
                        >
                          <span
                            className={`absolute -top-5 left-0 ${boundingBox.badgeBg || "bg-red-500"} text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-md font-sans`}
                          >
                            {boundingBox.label}
                          </span>
                          {/* Bounding Box Corner Ticks */}
                          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                        </div>
                      )}

                      {/* CCTV Static Image */}
                      <img
                        src={cctvImage}
                        alt="CCTV footage preview"
                        className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
                      />

                      {/* Laser scan effect overlay */}
                      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#10b981]/50 shadow-[0_0_15px_#10b981] scan-line pointer-events-none z-10 animate-scan" />

                      {/* Recording status label */}
                      <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white/70 tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        CCTV ● INFERENCE
                      </div>

                      <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white/50 tracking-wider">
                        AGS-NODE-32
                      </div>

                      <div className="absolute bottom-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white/60 tracking-wider flex gap-4">
                        <span>FPS: 24.0</span>
                        <span>LATENCY: 32ms</span>
                        <span>ZOOM: 1.5X</span>
                      </div>
                    </div>
                  ) : (
                    /* Default Line Chart mode */
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                            {chartTitle}
                          </div>
                          <div className="mt-1 text-2xl font-bold text-white">
                            {chartValue}{" "}
                            <span className="text-xs font-medium text-emerald-400">
                              {chartChange}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-[10px] font-mono text-white/50">
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-white">
                            24h
                          </span>
                          <span className="px-2 py-0.5">7d</span>
                          <span className="px-2 py-0.5">30d</span>
                        </div>
                      </div>

                      <div className="relative mt-3">
                        <svg
                          viewBox="0 0 400 120"
                          preserveAspectRatio="none"
                          className="h-32 w-full"
                        >
                          <defs>
                            <linearGradient id={chartAreaGradId} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
                              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id={chartLineGradId} x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0%" stopColor={accentColor} />
                              <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                            <filter
                              id={`glow-${roleName}`}
                              x="-20%"
                              y="-20%"
                              width="140%"
                              height="140%"
                            >
                              <feGaussianBlur stdDeviation="2.5" result="b" />
                              <feMerge>
                                <feMergeNode in="b" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Chart Grid Lines */}
                          {[20, 50, 80].map((yVal) => (
                            <line
                              key={yVal}
                              x1="0"
                              x2="400"
                              y1={yVal}
                              y2={yVal}
                              stroke="rgba(255,255,255,0.05)"
                              strokeDasharray="2 4"
                            />
                          ))}

                          {/* Chart Area Fill */}
                          <path
                            d={chartAreaPath}
                            fill={`url(#${chartAreaGradId})`}
                            style={{
                              transition: "opacity 1.2s ease 0.4s",
                            }}
                          />

                          {/* Chart Line */}
                          <path
                            d={chartLinePath}
                            fill="none"
                            stroke={`url(#${chartLineGradId})`}
                            strokeWidth="2"
                            filter={`url(#glow-${roleName})`}
                            style={{
                              transition: "stroke-dashoffset 1.6s ease-in-out",
                            }}
                          />

                          {/* Static indicators & ticks */}
                          <circle
                            cx="270"
                            cy="62"
                            r="4.5"
                            fill={accentColor}
                            stroke="#0A0E1F"
                            strokeWidth="2"
                          />
                          <circle cx="270" cy="62" r="8" fill="none" stroke={`${accentColor}44`} />
                        </svg>

                        {/* Tooltip Card */}
                        <div
                          className="absolute pointer-events-none"
                          style={{ left: "calc(67.5% - 56px)", top: "8%" }}
                        >
                          <div className="rounded-lg border border-white/10 bg-[#0B1024]/90 px-2.5 py-1.5 text-[10px] shadow-lg backdrop-blur-xl">
                            <div className="font-mono text-white/40">{chartTooltipTime}</div>
                            <div className="font-semibold text-white">{chartTooltipValue}</div>
                            <div className="text-[9px]" style={{ color: accentColor }}>
                              {chartTooltipChange}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sparkline mini-charts */}
              {sparklines.map((k, i) => {
                const max = Math.max(...k.sparkPoints);
                const pts = k.sparkPoints
                  .map(
                    (val, idx) =>
                      `${(idx / (k.sparkPoints.length - 1)) * 100},${30 - (val / (max || 1)) * 24}`,
                  )
                  .join(" ");
                return (
                  <div
                    key={i}
                    className="col-span-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:col-span-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-white/45 uppercase tracking-wider">
                        {k.label}
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-mono"
                        style={{ background: `${k.color}1a`, color: k.color }}
                      >
                        {k.change}
                      </span>
                    </div>
                    <div className="mt-2 text-xl font-bold text-white">{k.value}</div>
                    <svg
                      viewBox="0 0 100 30"
                      preserveAspectRatio="none"
                      className="mt-2 h-6 w-full"
                    >
                      <polyline
                        points={pts}
                        fill="none"
                        stroke={k.color}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                      <polyline points={`${pts} 100,30 0,30`} fill={k.color} opacity="0.08" />
                    </svg>
                  </div>
                );
              })}

              {/* Live activity feed */}
              <div className="col-span-12 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Live Event Stream
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    streaming active
                  </span>
                </div>

                <ul className="mt-3 grid gap-1.5 text-[11px] sm:grid-cols-3">
                  {liveEvents.map((evt, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 text-left"
                    >
                      <span className="font-mono text-white/40">{evt.time}</span>
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: evt.color }}
                      />
                      <span className="flex-1 truncate text-white/80">{evt.message}</span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-mono uppercase"
                        style={{ background: `${evt.color}22`, color: evt.color }}
                      >
                        {evt.tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      {floatingChips.map((chip, idx) => {
        const ChipIcon = chip.icon;
        return (
          <div
            key={idx}
            className={`absolute z-20 hidden items-center gap-2.5 rounded-xl border border-white/10 bg-[#070913]/90 hover:bg-white/[0.08] px-3 py-2.5 text-xs text-white shadow-xl backdrop-blur-2xl lg:flex transition-all duration-500 hover:scale-105 ${chip.xPosClass} ${chip.yPosClass}`}
          >
            <div
              className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${chip.gradFrom} ${chip.gradTo}`}
            >
              <ChipIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <div className="font-semibold">{chip.title}</div>
              <div className="text-[10px] text-white/50">{chip.subtitle}</div>
            </div>
          </div>
        );
      })}

      {/* Copilot overlay footer */}
      <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#0c0d21] px-3 py-1.5 text-[11px] text-white backdrop-blur-2xl md:inline-flex shadow-lg hover:scale-105 transition-transform duration-300">
        <Sparkles className="h-3.5 w-3.5 text-emerald-300 animate-pulse" />
        {copilotStatus}
      </div>
    </div>
  );
}

import { Camera, Globe, Volume2, ShieldCheck, Activity, Users } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import { DashboardMockupCard, DashboardMockupCardProps } from "./DashboardMockupCard";

// AgriShield edge intelligence console data
const edgeIntelProps: DashboardMockupCardProps = {
  roleName: "edge_intel",
  accentColor: "#10b981",
  successScore: 96,
  successStatus: "Cams Active: 217/217",
  progressMetrics: [
    {
      label: "Intrusion Scan Rate",
      value: "2.8s",
      percentage: 96,
      fromColor: "#10B981",
      toColor: "#047857",
    },
    {
      label: "Boar Lock Certainty",
      value: "97.4%",
      percentage: 97,
      fromColor: "#34D399",
      toColor: "#059669",
    },
  ],
  chartTitle: "Edge Neural Frame Latency",
  chartValue: "32 ms average",
  chartChange: "↓ 14% latency drop",
  chartAreaGradId: "edge-area-grad",
  chartLineGradId: "edge-line-grad",
  chartLinePath:
    "M0,80 C30,72 50,60 80,58 C110,56 130,30 170,35 C210,40 230,70 270,62 C310,55 340,22 400,28",
  chartAreaPath:
    "M0,80 C30,72 50,60 80,58 C110,56 130,30 170,35 C210,40 230,70 270,62 C310,55 340,22 400,28 L400,110 L0,110 Z",
  chartTooltipTime: "Zone 3 · East Fence",
  chartTooltipValue: "32ms delay",
  chartTooltipChange: "Sub-3s intrusion warnings active",
  sparklines: [
    {
      label: "Intrusion Alerts",
      value: "48",
      change: "+8 alerts",
      color: "#10b981",
      sparkPoints: [32, 35, 30, 42, 38, 44, 45, 48],
    },
    {
      label: "Power Cells",
      value: "12/12",
      change: "100% active",
      color: "#34D399",
      sparkPoints: [12, 12, 12, 12, 12, 12, 12, 12],
    },
  ],
  liveEvents: [
    {
      time: "11:05",
      message: "Wild Boar Lock: Zone 3 (East) · Bounding Box active",
      color: "#ef4444",
      tag: "lock",
    },
    {
      time: "11:02",
      message: "Radar sonar beam frequency sweeping",
      color: "#10B981",
      tag: "sweep",
    },
    {
      time: "10:55",
      message: "Camera feed Node 8 recalibrated",
      color: "#10B981",
      tag: "calibrated",
    },
  ],
  sidebarItems: [
    { icon: Camera, label: "Edge Monitor", active: true },
    { icon: ShieldCheck, label: "Neural Matrix" },
  ],
  floatingChips: [
    {
      title: "Wild Boar Lock",
      subtitle: "Zone 3 · Threat: High",
      icon: Camera,
      gradFrom: "from-emerald-500",
      gradTo: "to-teal-600",
      xPosClass: "left-3",
      yPosClass: "top-24",
    },
  ],
  copilotStatus:
    'Copilot: "Optimized neural weights for night thermal vision scans, eliminating false alarms."',
  cctvImage: "/agrishield_boar.png",
  boundingBox: {
    label: "WILD BOAR [97.4%]",
    top: "22%",
    left: "26%",
    width: "48%",
    height: "64%",
    colorClass: "border-red-500 bg-red-500/10",
    badgeBg: "bg-red-500",
  },
};

// AgriShield Gujarat village safety network data
const villageNetworkProps: DashboardMockupCardProps = {
  roleName: "village_network",
  accentColor: "#10b981",
  successScore: 92,
  successStatus: "Grid Status: Synced",
  progressMetrics: [
    {
      label: "Mesh Signal Density",
      value: "92%",
      percentage: 92,
      fromColor: "#34D399",
      toColor: "#10B981",
    },
    {
      label: "SMS Broadcast Rate",
      value: "99.8%",
      percentage: 98,
      fromColor: "#10B981",
      toColor: "#047857",
    },
  ],
  chartTitle: "Gujarat Village Mesh Uptime",
  chartValue: "99.8% Integrity",
  chartChange: "↑ 12% mesh density",
  chartAreaGradId: "village-area-grad",
  chartLineGradId: "village-line-grad",
  chartLinePath: "M0,95 C40,93 80,90 120,85 C160,78 200,68 240,54 C280,36 320,18 400,2",
  chartAreaPath:
    "M0,95 C40,93 80,90 120,85 C160,78 200,68 240,54 C280,36 320,18 400,2 L400,110 L0,110 Z",
  chartTooltipTime: "Surat Pilot Grid",
  chartTooltipValue: "99.8% mesh strength",
  chartTooltipChange: "Cooperative network grid active",
  sparklines: [
    {
      label: "Mesh Nodes",
      value: "142",
      change: "6 active",
      color: "#10B981",
      sparkPoints: [110, 115, 120, 126, 130, 135, 140, 142],
    },
    {
      label: "Call Latency",
      value: "4.2s",
      change: "-12s latency",
      color: "#34D399",
      sparkPoints: [8.5, 7.2, 6.8, 5.5, 5.0, 4.5, 4.3, 4.2],
    },
  ],
  liveEvents: [
    {
      time: "11:03",
      message: "Gujarat Village Mesh alert dispatch sync",
      color: "#10B981",
      tag: "mesh",
    },
    {
      time: "11:01",
      message: "Node 9 broadcasted alarm sync to Surat Coop",
      color: "#10B981",
      tag: "broadcast",
    },
    { time: "10:48", message: "SMS engine ready: Rajkot Node 4", color: "#10B981", tag: "ready" },
  ],
  sidebarItems: [
    { icon: Users, label: "Village Network", active: true },
    { icon: Globe, label: "Surat Fields Map" },
  ],
  floatingChips: [
    {
      title: "Gujarat Pilot Sync",
      subtitle: "Crop Guard Console",
      icon: Globe,
      gradFrom: "from-emerald-500",
      gradTo: "to-teal-600",
      xPosClass: "-right-6",
      yPosClass: "bottom-20",
    },
  ],
  copilotStatus:
    'Copilot: "Village alert dispatch pipeline running optimally. Broadcast latency reduced to 2.4s."',
  cctvImage: "/agrishield_village.png",
  boundingBox: {
    label: "COOPERATIVE GRID [ACTIVE]",
    top: "16%",
    left: "14%",
    width: "72%",
    height: "68%",
    colorClass: "border-emerald-500 bg-emerald-500/10",
    badgeBg: "bg-emerald-500",
  },
};

// AgriShield acoustic deterrent system data
const sirenControllerProps: DashboardMockupCardProps = {
  roleName: "siren_controller",
  accentColor: "#10b981",
  successScore: 99,
  successStatus: "Ultrasonics: Online",
  progressMetrics: [
    {
      label: "Ultrasonic Repulsion Freq",
      value: "24.1kHz",
      percentage: 99,
      fromColor: "#10B981",
      toColor: "#047857",
    },
    {
      label: "Alarm Amplitude",
      value: "110dB max",
      percentage: 90,
      fromColor: "#34D399",
      toColor: "#059669",
    },
  ],
  chartTitle: "Repulsion Sonic Decibels",
  chartValue: "120 dB output",
  chartChange: "↑ 10% volume sweep",
  chartAreaGradId: "siren-area-grad",
  chartLineGradId: "siren-line-grad",
  chartLinePath: "M0,70 C40,75 80,60 120,55 C160,50 200,30 240,25 C280,45 320,15 400,10",
  chartAreaPath:
    "M0,70 C40,75 80,60 120,55 C160,50 200,30 240,25 C280,45 320,15 400,10 L400,110 L0,110 Z",
  chartTooltipTime: "Siren Station AGS-01",
  chartTooltipValue: "120dB active",
  chartTooltipChange: "Repulsion audio frequencies sweep",
  sparklines: [
    {
      label: "Siren Alarms Fired",
      value: "142",
      change: "+14 alarms",
      color: "#10B981",
      sparkPoints: [110, 115, 120, 126, 130, 135, 142, 142],
    },
    {
      label: "Sync Rate",
      value: "99.9%",
      change: "stable active",
      color: "#34D399",
      sparkPoints: [99.5, 99.6, 99.7, 99.8, 99.9, 99.9, 99.9, 99.9],
    },
  ],
  liveEvents: [
    {
      time: "11:04",
      message: "AGS-SIREN-01 fired Ultrasonic Sweep 3",
      color: "#ef4444",
      tag: "alarm",
    },
    {
      time: "11:01",
      message: "Ultrasonic sweeps frequency calibrated for Nilgai",
      color: "#10B981",
      tag: "frequency",
    },
    {
      time: "10:44",
      message: "Speaker telemetry logs verified",
      color: "#10B981",
      tag: "verified",
    },
  ],
  sidebarItems: [
    { icon: Volume2, label: "Speaker Array", active: true },
    { icon: Activity, label: "Sonic Sweeps" },
  ],
  floatingChips: [
    {
      title: "Decibels: 120dB",
      subtitle: "repulsion alarm loops",
      icon: Volume2,
      gradFrom: "from-emerald-500",
      gradTo: "to-teal-600",
      xPosClass: "-left-6",
      yPosClass: "bottom-16",
    },
  ],
  copilotStatus:
    'Copilot: "Ultrasonic speaker sweep calibrated. Nilgai safely repelled from East border fields."',
  cctvImage: "/agrishield_siren.png",
  boundingBox: {
    label: "ACTIVE DYNAMIC STROBE",
    top: "20%",
    left: "30%",
    width: "40%",
    height: "60%",
    colorClass: "border-red-500 bg-red-500/10",
    badgeBg: "bg-red-500",
  },
};

export function DashboardSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-[#070405] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Title Section */}
        <div className="mb-16 text-left max-w-6xl mx-auto px-2 transition-opacity duration-700">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="size-4 text-primary animate-pulse" />
            <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.25em] text-primary font-inter">
              Live Subsystems Simulation
            </span>
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-light italic font-instrument tracking-tight leading-none text-white">
            Integrated Operations.
          </h2>
          <p className="mt-4 text-sm md:text-base font-light text-white/60 max-w-xl leading-relaxed font-inter">
            Experience the core diagnostic console views of AgriShield AI. Scroll to inspect active
            camera scans, village warning nets, and acoustic deterrent controls.
          </p>
        </div>

        {/* ScrollStack Wrapper */}
        <ScrollStack
          useWindowScroll={true} // Pin relative to global window scroll
          itemDistance={120} // Distance spacing between cards static states
          baseScale={0.88} // Base starting scale for cards stacked below
          itemScale={0.03} // Scale gain increment per stacked item level
          itemStackDistance={35} // Top pixel padding stack offset
          rotationAmount={0} // Optional skew rotation on stack
          blurAmount={0} // Optional blur of lower level elements in stack
          stackPosition="12%" // Offset when cards pin at screen-top relative to viewport
        >
          <ScrollStackItem>
            <DashboardMockupCard {...edgeIntelProps} />
          </ScrollStackItem>
          <ScrollStackItem>
            <DashboardMockupCard {...villageNetworkProps} />
          </ScrollStackItem>
          <ScrollStackItem>
            <DashboardMockupCard {...sirenControllerProps} />
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, Map as MapIcon, ShieldCheck, Clock, MapPin, Search, Maximize, Bell, BrainCircuit, Plus, MoreVertical, Edit2, Trash2, Zap, AlertTriangle } from "lucide-react";
import { MapContainer, TileLayer, Polygon, Polyline } from "react-leaflet";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill } from "@/components/shield-ui";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/heatmap")({
  validateSearch: (search: Record<string, unknown>) => ({
    intrusion: search.intrusion as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Farm Heat Map — AgriShield AI" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <HeatmapPage />
    </AuthGuard>
  ),
});

// Demo Data for Historical Analytics
const weeklyData = [
  { day: 'Mon', detected: 4, deterred: 3 },
  { day: 'Tue', detected: 2, deterred: 2 },
  { day: 'Wed', detected: 6, deterred: 5 },
  { day: 'Thu', detected: 3, deterred: 3 },
  { day: 'Fri', detected: 8, deterred: 7 },
  { day: 'Sat', detected: 5, deterred: 5 },
  { day: 'Sun', detected: 7, deterred: 6 },
];

const directionalData = [
  { subject: 'North', A: 120, fullMark: 150 },
  { subject: 'North-East', A: 98, fullMark: 150 },
  { subject: 'East', A: 45, fullMark: 150 },
  { subject: 'South-East', A: 20, fullMark: 150 },
  { subject: 'South', A: 35, fullMark: 150 },
  { subject: 'South-West', A: 15, fullMark: 150 },
  { subject: 'West', A: 40, fullMark: 150 },
  { subject: 'North-West', A: 85, fullMark: 150 },
];

function getHighlightedEdge(points: {lat: number, lng: number}[], direction?: string) {
  if (!points || points.length < 2 || !direction) return null;
  
  let targetIndex = 0;
  const dir = direction.toLowerCase();
  
  if (dir.includes("north")) {
    let maxLat = -Infinity;
    for(let i=0; i<points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i+1)%points.length];
      const midLat = (p1.lat + p2.lat) / 2;
      if (midLat > maxLat) {
        maxLat = midLat;
        targetIndex = i;
      }
    }
  } else if (dir.includes("south")) {
    let minLat = Infinity;
    for(let i=0; i<points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i+1)%points.length];
      const midLat = (p1.lat + p2.lat) / 2;
      if (midLat < minLat) {
        minLat = midLat;
        targetIndex = i;
      }
    }
  } else if (dir.includes("east")) {
    let maxLng = -Infinity;
    for(let i=0; i<points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i+1)%points.length];
      const midLng = (p1.lng + p2.lng) / 2;
      if (midLng > maxLng) {
        maxLng = midLng;
        targetIndex = i;
      }
    }
  } else if (dir.includes("west")) {
    let minLng = Infinity;
    for(let i=0; i<points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i+1)%points.length];
      const midLng = (p1.lng + p2.lng) / 2;
      if (midLng < minLng) {
        minLng = midLng;
        targetIndex = i;
      }
    }
  } else {
    return null;
  }
  
  return [points[targetIndex], points[(targetIndex+1)%points.length]];
}

function HeatmapPage() {
  const { farmBoundary, setFarmBoundary } = useAppState();
  const { intrusion } = Route.useSearch();
  const navigate = useNavigate();
  
  // Calculate center of the polygon
  const center = farmBoundary && farmBoundary.length > 0
    ? [farmBoundary[0].lat, farmBoundary[0].lng]
    : [23.0225, 72.5714];

  const highlightedEdge = farmBoundary ? getHighlightedEdge(farmBoundary, intrusion) : null;

  return (
    <AppShell
      title="Farm Heat Map"
      subtitle="Intrusion density visualization & historical pattern analysis"
    >
      <div className="mx-auto max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-12">
        
        {/* Section 1: Top Status & Live Map */}
        <div>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="col-span-2 md:col-span-1 bg-surface border border-border/50 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Monitoring Status</h3>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">Active</p>
              <p className="text-xs font-medium text-muted-foreground mt-1">AI Boundary Guard Online</p>
            </div>
            
            <div className="col-span-2 md:col-span-1 bg-surface border border-border/50 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-warning/10 rounded-xl text-warning">
                  <Clock className="size-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Last Detection</h3>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{intrusion ? "Just Now" : "2 hrs ago"}</p>
              <p className="text-xs font-medium text-muted-foreground mt-1">{intrusion ? "Intrusion detected" : "Awaiting next event"}</p>
            </div>
            
            <div className="col-span-2 md:col-span-2 bg-surface border border-border/50 rounded-[1.5rem] p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-bold text-sm text-foreground mb-1">Threat Level</h3>
                <p className="text-xs font-medium text-muted-foreground">Overall perimeter security status</p>
              </div>
              <RiskPill level={intrusion ? "high" : "low"} />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            {/* Live Intrusion Analysis Map */}
            <PanelSection title="Live Intrusion Analysis" description="Dynamic boundary visualization based on AI detection data">
              {!farmBoundary ? (
                <div className="h-[500px] w-full rounded-[1.5rem] border-2 border-dashed border-border bg-surface/50 flex flex-col items-center justify-center p-8 text-center mt-2 group transition-all duration-300 hover:bg-surface/80 hover:border-primary/30">
                  <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <MapIcon className="size-10 text-primary opacity-80" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3 tracking-tight">No Farm Available</h3>
                  <p className="text-muted-foreground max-w-[400px] leading-relaxed">
                    Set up your farm boundary first to generate the intrusion heat map.
                  </p>
                  <div className="mt-8 flex gap-3">
                    <Button variant="default" className="rounded-xl font-bold bg-primary text-white hover:bg-primary/90 h-11 px-6 shadow-md" asChild>
                      <Link to="/farm-setup">
                        <Plus className="mr-2 size-4" /> Add My Farm
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-[500px] w-full rounded-[1.5rem] border border-border/50 shadow-inner bg-surface overflow-hidden relative mt-2">
                  {/* Farm Controls */}
                  <div className="absolute top-4 right-4 z-[1000] pointer-events-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur shadow-lg border-border rounded-xl hover:bg-white transition-colors">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl p-2 border-border/50">
                        <DropdownMenuItem className="rounded-lg cursor-pointer font-medium mb-1" onClick={() => navigate({ to: '/farm-setup' })}>
                          <Edit2 className="mr-2 size-4 text-primary" /> Edit Boundary
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg cursor-pointer font-medium mb-1" onClick={() => navigate({ to: '/heatmap', search: { intrusion: 'North' } })}>
                          <Zap className="mr-2 size-4 text-warning" /> Simulate Detection (North)
                        </DropdownMenuItem>
                        <div className="h-px bg-border/50 my-1 -mx-2" />
                        <DropdownMenuItem className="rounded-lg cursor-pointer font-medium text-destructive focus:bg-destructive/10 focus:text-destructive mt-1" onClick={() => { setFarmBoundary(null); navigate({ to: '/heatmap' }); }}>
                          <Trash2 className="mr-2 size-4" /> Delete Farm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <MapContainer center={center as [number, number]} zoom={15} className="h-full w-full z-0" zoomControl={false} dragging={false} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polygon 
                      positions={farmBoundary} 
                      pathOptions={{ 
                        color: intrusion ? 'hsl(var(--primary))' : 'hsl(var(--primary))', 
                        fillColor: 'hsl(var(--primary))', 
                        fillOpacity: 0.1,
                        weight: 2,
                        dashArray: '5, 5'
                      }} 
                    />
                    {highlightedEdge && (
                      <Polyline 
                        positions={highlightedEdge}
                        pathOptions={{ 
                          color: 'red', 
                          weight: 8,
                          lineCap: 'round',
                          lineJoin: 'round',
                        }}
                        className="animate-pulse shadow-2xl"
                      />
                    )}
                  </MapContainer>
                  
                  {/* Overlay for state */}
                  <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
                    {intrusion ? (
                      <div className="bg-destructive/90 backdrop-blur-md shadow-xl border border-destructive rounded-xl px-4 py-2 flex items-center gap-2 animate-in slide-in-from-top-4 duration-500">
                        <AlertTriangle className="size-4 text-white" />
                        <span className="font-bold text-sm text-white">Intrusion Detected: {intrusion}</span>
                      </div>
                    ) : (
                      <div className="bg-white/90 backdrop-blur-md shadow-xl border border-border/50 rounded-xl px-4 py-2 flex items-center gap-2">
                        <ShieldCheck className="size-4 text-primary" />
                        <span className="font-bold text-sm text-foreground">Farm Ready - Waiting for AI</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </PanelSection>

            {/* Current Detection Summary */}
            <PanelSection title="Detection Summary" description="Latest event details">
               <div className="bg-surface border border-border/50 rounded-[1.5rem] p-1 mt-2 shadow-sm hover:shadow-md transition-shadow h-[calc(100%-40px)]">
                 <div className="grid grid-cols-2 divide-x divide-y divide-border/50 h-full">
                    
                    <div className="p-5 flex flex-col gap-1 justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Animal</p>
                      <p className="text-base font-bold text-foreground">{intrusion ? "Wild Boar" : "--"}</p>
                    </div>
                    
                    <div className="p-5 flex flex-col gap-1 justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confidence</p>
                      <p className="text-base font-bold text-foreground">{intrusion ? "94%" : "--"}</p>
                    </div>

                    <div className="p-5 flex flex-col gap-1 justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entry Point</p>
                      <p className="text-base font-bold text-foreground">{intrusion || "--"}</p>
                    </div>

                    <div className="p-5 flex flex-col gap-1 justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Threat Level</p>
                      <p className="text-base font-bold text-destructive">{intrusion ? "High" : "--"}</p>
                    </div>

                    <div className="p-5 flex flex-col gap-1 border-b-0 col-span-2 justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deterrent Status</p>
                      <div className="flex items-center gap-2 mt-1">
                         <div className={`size-3 rounded-full ${intrusion ? 'bg-warning animate-pulse' : 'bg-border'}`} />
                         <p className="text-base font-bold text-foreground">{intrusion ? "Siren Activated" : "Standby"}</p>
                      </div>
                    </div>

                 </div>
               </div>
            </PanelSection>
          </div>
        </div>

        {/* Section 2: Historical Analytics */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="size-6 text-primary" />
            <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">Historical Intrusion Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <PanelSection title="Vulnerability Heat Map" description="Intrusion density by boundary region">
              <div className="bg-surface border border-border/50 rounded-[1.5rem] p-8 mt-2 shadow-sm hover:shadow-md transition-shadow">
                
                {/* The Heatmap Visualization */}
                <div className="relative w-full max-w-4xl mx-auto aspect-[21/9] bg-background/50 rounded-[2rem] border border-border/50 overflow-hidden flex items-center justify-center mb-8">
                  
                  {/* Farm Center Box */}
                  <div className="absolute inset-x-16 inset-y-12 border-2 border-primary/20 rounded-2xl bg-surface/40 backdrop-blur-sm z-10 flex items-center justify-center shadow-inner">
                    <span className="font-display font-bold text-muted-foreground/60 tracking-[0.2em] uppercase text-sm">Protected Farm Area</span>
                  </div>

                  {/* North Glow (Red - High) */}
                  <div className="absolute top-[-20px] inset-x-32 h-32 bg-destructive/60 blur-[40px] rounded-full animate-pulse opacity-90" style={{ animationDuration: '3s' }} />
                  <div className="absolute top-0 inset-x-48 h-16 bg-destructive blur-[30px] rounded-full animate-pulse opacity-100" style={{ animationDuration: '3s' }} />

                  {/* West Glow (Orange - Medium) */}
                  <div className="absolute left-[-20px] inset-y-20 w-32 bg-orange-500/50 blur-[40px] rounded-full animate-pulse opacity-80" style={{ animationDuration: '4s' }} />

                  {/* East Glow (Yellow - Low) */}
                  <div className="absolute right-[-20px] inset-y-20 w-32 bg-yellow-400/40 blur-[40px] rounded-full animate-pulse opacity-70" style={{ animationDuration: '4.5s' }} />

                  {/* South Glow (Green - Very Low) */}
                  <div className="absolute bottom-[-20px] inset-x-32 h-32 bg-primary/40 blur-[40px] rounded-full animate-pulse opacity-60" style={{ animationDuration: '5s' }} />
                  
                  {/* Grid Overlay for technical feel */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
                </div>

                {/* Legend & Insight */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/50 pt-6">
                  
                  {/* Legend */}
                  <div className="flex items-center gap-6 bg-background/50 py-3 px-6 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-destructive shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-primary shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Very Low</span>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="flex items-start gap-3 bg-primary/5 rounded-2xl p-4 max-w-lg border border-primary/10">
                    <BrainCircuit className="size-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      <span className="font-bold text-primary">AI Insight:</span> Highest intrusion activity has been observed near the North boundary. Additional deterrent coverage is recommended in this region.
                    </p>
                  </div>

                </div>
              </div>
            </PanelSection>
          </div>
        </div>

        {/* Section 3: AI Insights */}
        <div>
          <PanelSection title="AI Intelligence" description="Automated recommendations based on historical data">
            <div className="grid md:grid-cols-3 gap-6 mt-2">
              <div className="bg-gradient-to-br from-primary/10 via-surface to-surface border border-primary/20 rounded-[1.5rem] p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300">
                 <BrainCircuit className="absolute -top-6 -right-6 size-32 text-primary/5 rotate-12" />
                 <div className="relative z-10 space-y-4">
                   <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-border/50">
                     <AlertTriangle className="size-5 text-destructive" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Most Vulnerable Boundary</p>
                     <p className="text-xl font-display font-bold text-foreground">Northern Fence</p>
                     <p className="text-sm font-medium text-muted-foreground mt-2">Accounted for 42% of all intrusion attempts this month. Mostly wild boars.</p>
                   </div>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-warning/10 via-surface to-surface border border-warning/20 rounded-[1.5rem] p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300 delay-75">
                 <Clock className="absolute -top-6 -right-6 size-32 text-warning/5 -rotate-12" />
                 <div className="relative z-10 space-y-4">
                   <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-border/50">
                     <Activity className="size-5 text-warning" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-warning mb-1">Peak Intrusion Hours</p>
                     <p className="text-xl font-display font-bold text-foreground">11:00 PM – 03:00 AM</p>
                     <p className="text-sm font-medium text-muted-foreground mt-2">Nighttime visibility is crucial. Ensure infrared cameras are unobstructed.</p>
                   </div>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 via-surface to-surface border border-blue-500/20 rounded-[1.5rem] p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300 delay-150">
                 <Zap className="absolute -top-6 -right-6 size-32 text-blue-500/5 rotate-45" />
                 <div className="relative z-10 space-y-4">
                   <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-border/50">
                     <MapPin className="size-5 text-blue-500" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Recommended Action</p>
                     <p className="text-xl font-display font-bold text-foreground">Relocate Deterrents</p>
                     <p className="text-sm font-medium text-muted-foreground mt-2">Move the spare ultrasonic emitter to the North-West corner for optimal coverage.</p>
                   </div>
                 </div>
              </div>
            </div>
          </PanelSection>
        </div>

      </div>
    </AppShell>
  );
}

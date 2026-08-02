import React, { useMemo } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { 
  Flame, ShieldCheck, Map as MapIcon, Activity, Clock, Crosshair, MapPin, Search, BarChart3, 
  ChevronRight, AlertTriangle, Info, Zap, Camera, Trash2
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill } from "@/components/shield-ui";
import { Button } from "@/components/ui/button";
import { Map, MapPolygon, MapHeatmapLayer } from "@/components/ui/map";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

// Define the expected search parameters for this route
type HeatMapSearch = {
  detected?: boolean;
};

export const Route = createFileRoute("/farm-heatmap")({
  validateSearch: (search: Record<string, unknown>): HeatMapSearch => {
    return {
      detected: search['detected'] === 'true' || search['detected'] === true,
    };
  },
  head: () => ({
    meta: [
      { title: "Farm Intrusion Heat Map — AgriShield AI" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <FarmHeatMapPage />
    </AuthGuard>
  ),
});

function FarmHeatMapPage() {
  const { detected } = useSearch({ from: "/farm-heatmap" });
  const { profile, updateProfile } = useAppState();
  
  const hasFarm = !!profile.farmBoundary;
  const showDashboard = detected || hasFarm;

  // Generate heatmap points clustered near the North-West boundary
  const heatPoints = useMemo(() => {
    const boundary = profile.farmBoundary?.coordinates;
    if (!boundary || boundary.length === 0) {
      return Array.from({ length: 150 }).map(() => [
        23.02 + (Math.random() - 0.5) * 0.02,
        72.57 + (Math.random() - 0.5) * 0.02,
        Math.random()
      ] as [number, number, number]);
    }
    
    let maxLat = -Infinity, minLat = Infinity;
    let minLng = Infinity, maxLng = -Infinity;
    for (const [lat, lng] of boundary) {
      if (lat > maxLat) maxLat = lat;
      if (lat < minLat) minLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }
    
    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;
    
    // Spread should be very tight (5% of farm size) to keep it on the border
    const latSpread = latSpan * 0.05;
    const lngSpread = lngSpan * 0.05;
    
    const points: [number, number, number][] = [];
    
    // Spot 1: Primary Breach (Red - High Intensity)
    const p1 = boundary[0];
    if (p1) {
      for (let i = 0; i < 120; i++) {
        points.push([
          p1[0] + (Math.random() - 0.5) * latSpread,
          p1[1] + (Math.random() - 0.5) * lngSpread,
          0.8 + Math.random() * 0.2 // Intensity 0.8 - 1.0 (Red)
        ]);
      }
    }
    
    // Spot 2: Secondary Approach (Yellow - Medium Intensity)
    if (boundary.length > 1) {
      const p2 = boundary[1];
      if (p2) {
        for (let i = 0; i < 80; i++) {
          points.push([
            p2[0] + (Math.random() - 0.5) * latSpread,
            p2[1] + (Math.random() - 0.5) * lngSpread,
            0.4 + Math.random() * 0.2 // Intensity 0.4 - 0.6 (Yellow)
          ]);
        }
      }
    }

    // Spot 3: Minor Activity (Green - Low Intensity)
    if (boundary.length > 2) {
      const p3 = boundary[2];
      if (p3) {
        for (let i = 0; i < 50; i++) {
          points.push([
            p3[0] + (Math.random() - 0.5) * latSpread,
            p3[1] + (Math.random() - 0.5) * lngSpread,
            0.1 + Math.random() * 0.2 // Intensity 0.1 - 0.3 (Green)
          ]);
        }
      }
    }

    return points;
  }, [profile.farmBoundary]);

  return (
    <AppShell
      title="Intrusion Heat Map"
      subtitle="Spatial analysis of perimeter breaches"
    >
      <div className="mx-auto max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* FARM CONTROLS */}
        {hasFarm && (
          <div className="flex justify-end gap-3 mb-6">
            <Button 
              variant="outline"
              className="rounded-full bg-surface/50 font-bold border-border shadow-sm hover:bg-surface/80 transition-colors"
              onClick={() => window.location.href = '/setup-boundary'}
            >
              <MapIcon className="size-4 mr-2" /> Edit Boundary
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full bg-surface/50 font-bold border-border shadow-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your farm boundary?")) {
                  updateProfile({ farmBoundary: null as any });
                  window.location.reload();
                }
              }}
            >
              <Trash2 className="size-4 mr-2" /> Delete Farm
            </Button>
          </div>
        )}

        {/* HERO SECTION / QUICK STATS */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-border bg-surface/50 p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
              <h3 className="font-display text-xl font-bold text-primary">Monitoring</h3>
            </div>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="size-5 animate-pulse" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface/50 p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Last Intrusion</p>
              <h3 className="font-display text-xl font-bold text-foreground">{detected ? "2 mins ago" : "--"}</h3>
            </div>
            <div className="size-10 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground">
              <Clock className="size-5" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface/50 p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Zones</p>
              <h3 className="font-display text-xl font-bold text-foreground">4 Active</h3>
            </div>
            <div className="size-10 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground">
              <MapIcon className="size-5" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">AI Insights</p>
              <h3 className="font-display text-xl font-bold text-foreground">Active</h3>
            </div>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="size-5" />
            </div>
          </div>
        </div>

        {showDashboard ? (
          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* LIVE INTRUSION ANALYSIS (MAP CONTAINER) */}
              <PanelSection 
                title={hasFarm ? profile.farmBoundary!.name : "Live Intrusion Map"} 
                description={hasFarm ? `Area: ${profile.farmBoundary!.area} Acres` : "Spatial plotting of the most recent perimeter breach."}
                className="p-6 h-[500px] flex flex-col"
              >
                <div className="flex-1 w-full rounded-[1.5rem] bg-black/5 border border-border/50 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                  {hasFarm ? (
                    <div className="absolute inset-0 size-full">
                      <Map 
                        center={
                          profile.farmBoundary!.coordinates.length > 0 && profile.farmBoundary!.coordinates[0]
                            ? [profile.farmBoundary!.coordinates[0][1], profile.farmBoundary!.coordinates[0][0]] 
                            : [72.57, 23.02]
                        } 
                        zoom={14}
                      >
                        <MapPolygon 
                          positions={profile.farmBoundary!.coordinates} 
                          color={detected ? "#EF4444" : "#65a30d"} 
                          fillOpacity={detected ? 0.3 : 0.25} 
                          weight={detected ? 4 : 4}
                          className={detected ? "animate-pulse" : ""}
                        />
                        <MapHeatmapLayer 
                          points={heatPoints} 
                          radius={18} 
                          blur={15} 
                          gradient={{ 0.3: 'lime', 0.6: 'yellow', 1.0: 'red' }} 
                        />
                      </Map>
                      
                      {/* Direction Overlay */}
                      <div className="absolute top-6 left-6 z-[400] flex flex-col gap-2 pointer-events-none animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="px-4 py-2 rounded-xl bg-surface/90 border border-border text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2">
                          <AlertTriangle className="size-4 text-destructive" />
                          <span className="text-foreground">Primary Entry: North-West</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-surface/90 border border-border text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2">
                          <Crosshair className="size-4 text-warning" />
                          <span className="text-foreground">High Frequency: Wild Boar</span>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-6 left-6 z-[400] flex gap-2 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                          Spatial Data Active
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Premium Empty State for Map (No Farm) */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="size-20 rounded-full bg-white shadow-lg border border-border flex items-center justify-center mb-6 relative z-10 animate-bounce">
                        <MapPin className="size-8 text-primary drop-shadow-md" />
                      </div>
                      
                      <h3 className="text-xl font-display font-bold text-foreground relative z-10">Map Initialization Pending</h3>
                      <p className="text-sm font-medium text-muted-foreground max-w-md text-center mt-2 relative z-10">
                        The spatial heat map rendering engine requires a farm boundary to plot coordinate data.
                      </p>
                      
                      <Button 
                        className="mt-6 rounded-full px-6 shadow-lg font-bold bg-primary text-black hover:bg-primary/90 relative z-10"
                        onClick={() => window.location.href = '/setup-boundary'}
                      >
                        <MapPin className="mr-2 size-4" />
                        Add My Farm
                      </Button>
                    </>
                  )}
                </div>
              </PanelSection>

            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* DETECTION SUMMARY */}
              <PanelSection 
                title="Detection Summary" 
                description="Details of the latest event"
                className="p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface/50 rounded-2xl border border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-border">
                        <Crosshair className="size-5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Animal</p>
                        <p className="font-bold text-foreground">Wild Boar</p>
                      </div>
                    </div>
                    <RiskPill level="high" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface/50 rounded-2xl border border-border">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Confidence</p>
                      <p className="font-display font-bold text-lg mt-1 text-foreground">96.4%</p>
                    </div>
                    <div className="p-4 bg-surface/50 rounded-2xl border border-border">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Direction</p>
                      <p className="font-display font-bold text-lg mt-1 text-foreground">North</p>
                    </div>
                    <div className="p-4 bg-surface/50 rounded-2xl border border-border col-span-2">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
                      <p className="font-bold text-sm mt-1 text-primary flex items-center">
                        <ShieldCheck className="size-4 mr-2" />
                        Deterrent Successfully Deployed
                      </p>
                    </div>
                  </div>
                </div>
              </PanelSection>

              {/* AI INSIGHTS */}
              <PanelSection 
                title="AI Spatial Insights" 
                description="Predictive intelligence"
                className="p-6 flex-1 flex flex-col"
              >
                <div className="flex-1 rounded-[1.5rem] border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-5 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="size-4 text-warning" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Most Vulnerable</h5>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground pl-6">
                      North-West Boundary (Near Forest Line)
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="size-4 text-primary" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Peak Intrusion</h5>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground pl-6">
                      01:00 AM - 04:30 AM
                    </p>
                  </div>

                  <div className="pt-4 border-t border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-md mt-0.5">
                        <Info className="size-3.5 text-primary" />
                      </div>
                      <p className="text-xs font-medium text-primary leading-relaxed">
                        <strong className="font-bold">Suggestion:</strong> Relocate acoustic deterrent #2 closer to the North-West zone to optimize coverage based on recent clustering.
                      </p>
                    </div>
                  </div>
                </div>
              </PanelSection>
            </div>
          </div>
        ) : (
          /* EMPTY STATE (NO DETECTION & NO FARM) */
          <div className="h-[600px] w-full flex flex-col items-center justify-center bg-surface/30 rounded-[2rem] border-2 border-dashed border-border/60 animate-in fade-in duration-1000 p-8 text-center">
             <div className="size-24 rounded-full bg-white shadow-xl border border-border flex items-center justify-center mb-8 relative">
               <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
               <MapPin className="size-10 text-muted-foreground/50" />
             </div>
             <h2 className="font-display text-3xl font-bold text-foreground mb-3 tracking-tight">Farm Boundary Required</h2>
             <p className="text-lg text-muted-foreground font-medium max-w-[500px] mb-8 leading-relaxed">
               Please configure your farm's GIS boundary to enable Heat Map plotting and advanced AI spatial analytics.
             </p>
             <Button 
               variant="default"
               className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 bg-primary text-black hover:bg-primary/90"
               onClick={() => window.location.href = '/setup-boundary'}
             >
               <MapPin className="mr-2 size-4" />
               Add My Farm
             </Button>
          </div>
        )}

      </div>
    </AppShell>
  );
}

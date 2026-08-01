import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Clock, ExternalLink, Activity } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill } from "@/components/shield-ui";
import { REGIONS, severityLabel, type Severity } from "@/lib/agrishield-data";
import { cn } from "@/lib/utils";
import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerPopup } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Coordinates and details mapped for Gujarat districts
const REGION_COORDS: Record<
  string,
  { lat: number; lng: number; image: string; uptime: string; notes: string }
> = {
  Ahmedabad: {
    lat: 23.0225,
    lng: 72.5714,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop",
    uptime: "Uptime: 99.4%",
    notes: "High wild boar intrusion activity logged near eastern forest borders.",
  },
  Gandhinagar: {
    lat: 23.2156,
    lng: 72.6369,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=300&h=200&fit=crop",
    uptime: "Uptime: 99.8%",
    notes: "Nilgai groups reported moving across perimeter farmlands.",
  },
  Rajkot: {
    lat: 22.3039,
    lng: 70.8022,
    image: "https://images.unsplash.com/photo-1500937386664-56d159062255?w=300&h=200&fit=crop",
    uptime: "Uptime: 99.1%",
    notes: "Stray cattle herds causing trampling reports on southern crops.",
  },
  Surat: {
    lat: 21.1702,
    lng: 72.8311,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&h=200&fit=crop",
    uptime: "Uptime: 99.7%",
    notes: "Low intrusion reports; active acoustic repulsion active.",
  },
  Bhavnagar: {
    lat: 21.7645,
    lng: 72.1519,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=200&fit=crop",
    uptime: "Uptime: 98.9%",
    notes: "Monkeys raiding horticulture farms during early morning hours.",
  },
  Kutch: {
    lat: 23.7337,
    lng: 69.8597,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop",
    uptime: "Uptime: 99.5%",
    notes: "Frequent wild boar intrusions registered across dry farming zones.",
  },
  Vadodara: {
    lat: 22.3072,
    lng: 73.1812,
    image: "https://images.unsplash.com/photo-1589923188900-85dae4400f7b?w=300&h=200&fit=crop",
    uptime: "Uptime: 99.9%",
    notes: "Stable crop monitoring with zero high-threat intrusion warnings.",
  },
  Junagadh: {
    lat: 21.5222,
    lng: 70.4579,
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=300&h=200&fit=crop",
    uptime: "Uptime: 99.3%",
    notes: "Forest boundary buffer zones scanning for animal movement.",
  },
};

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Regional Heatmap — AgriShield AI" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <HeatmapPage />
    </AuthGuard>
  ),
});

function HeatmapPage() {
  const [active, setActive] = useState(REGIONS[0]!.name);
  const selected = REGIONS.find((r) => r.name === active)!;

  return (
    <AppShell
      title="Regional Heatmap"
      subtitle="Interactive district intrusion density for Gujarat telemetry"
    >
      <div className="mx-auto max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          
          {/* Map Panel */}
          <PanelSection title="Gujarat Activity Map" description="Tap a district marker for regional intelligence" className="p-4 md:p-6 pb-4">
            <div className="h-[600px] w-full rounded-[2rem] overflow-hidden border border-border/50 shadow-inner bg-surface">
              <Map center={[71.7, 22.4]} zoom={8.15}>
                {REGIONS.map((r) => {
                  const details = REGION_COORDS[r.name] || {
                    lat: 22.0,
                    lng: 72.0,
                    image:
                      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop",
                    uptime: "Uptime: 99%",
                    notes: "Scanning active.",
                  };

                  return (
                    <MapMarker key={r.name} longitude={details.lng} latitude={details.lat}>
                      <MarkerContent>
                        <div
                          onClick={() => setActive(r.name)}
                          className={cn(
                            "size-6 rounded-full border-[3px] border-white shadow-lg transition-all duration-300 hover:scale-125 flex items-center justify-center cursor-pointer",
                            r.risk === "high"
                              ? "bg-destructive shadow-[0_0_15px_var(--destructive)] animate-pulse"
                              : r.risk === "medium"
                                ? "bg-warning shadow-[0_0_15px_var(--warning)]"
                                : "bg-primary shadow-[0_0_15px_var(--primary)]",
                          )}
                        >
                          <span className="size-2 rounded-full bg-white/80 animate-ping" />
                        </div>
                        <MarkerLabel position="bottom" className="font-bold text-xs bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full mt-1 border border-border text-foreground">{r.name}</MarkerLabel>
                      </MarkerContent>

                      <MarkerPopup className="w-72 p-0 rounded-2xl overflow-hidden border-none shadow-2xl">
                        {/* Premium Light Theme Popup */}
                        <div className="relative h-32 overflow-hidden bg-surface">
                          <img
                            src={details.image}
                            alt={r.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 z-10">
                            <RiskPill level={r.risk} />
                          </div>
                          {/* Inner soft gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>

                        <div className="space-y-3 p-5 text-left bg-white">
                          <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                               <Activity className="size-3 text-primary" />
                               Intrusion Intensity: {r.detections} Logs
                            </p>
                            <h3 className="text-lg font-display font-bold text-foreground leading-tight tracking-tight">
                              {r.name} District
                            </h3>
                          </div>

                          <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                            {details.notes}
                          </p>

                          <div className="flex items-center gap-2 text-xs font-semibold text-primary pt-1 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                            <Clock className="size-3.5" />
                            {details.uptime}
                          </div>

                          <div className="flex gap-2 pt-3">
                            <Button
                              size="sm"
                              className="flex-1 rounded-xl font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform"
                              onClick={() => setActive(r.name)}
                            >
                              <Navigation className="size-3.5 mr-2" />
                              Focus Grid
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="px-3 rounded-xl border-border hover:bg-surface"
                              onClick={() => toast.success(`Viewing live telemetry for ${r.name}`)}
                            >
                              <ExternalLink className="size-3.5 text-foreground" />
                            </Button>
                          </div>
                        </div>
                      </MarkerPopup>
                    </MapMarker>
                  );
                })}
              </Map>
            </div>
          </PanelSection>

          {/* Right Column: Selected details and ranked lists */}
          <div className="flex flex-col gap-6">
            <PanelSection title={selected.name} description="Selected district overview" className="p-6 md:p-8">
              <div className="flex flex-col gap-2">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                        <MapPin className="size-6" />
                     </div>
                     <span className="font-display text-4xl font-bold tracking-tight text-foreground">
                       {selected.detections}
                     </span>
                   </div>
                   <RiskPill level={selected.risk} />
                 </div>
                 <p className="mt-3 text-sm font-medium text-muted-foreground leading-relaxed">
                   Verified intrusion events logged in the last 30 days across participating farms in this region.
                 </p>
              </div>
            </PanelSection>

            <PanelSection title="Regional Ranking" description="Districts sorted by intrusion volume" className="p-6 md:p-8 flex-1">
              <ul className="space-y-3 mt-2">
                {[...REGIONS]
                  .sort((a, b) => b.detections - a.detections)
                  .map((r, i) => (
                    <li key={r.name}>
                      <button
                        type="button"
                        onClick={() => setActive(r.name)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-[1.5rem] border px-4 py-3.5 text-left transition-all duration-300",
                          active === r.name
                            ? "border-primary/30 bg-primary shadow-md shadow-primary/20 text-white"
                            : "border-border bg-white hover:border-primary/40 hover:bg-surface hover:-translate-y-0.5 shadow-sm",
                        )}
                      >
                        <span className={cn("text-xs font-bold w-4", active === r.name ? "text-primary-foreground/80" : "text-muted-foreground")}>#{i + 1}</span>
                        <span className="flex-1 font-bold text-sm">{r.name}</span>
                        <span className={cn("text-sm font-bold tabular-nums", active === r.name ? "text-white" : "text-muted-foreground")}>{r.detections}</span>
                        <RiskPill level={r.risk} />
                      </button>
                    </li>
                  ))}
              </ul>
            </PanelSection>
          </div>
          
        </div>
      </div>
    </AppShell>
  );
}

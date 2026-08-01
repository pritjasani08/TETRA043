import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star, Navigation, Clock, ExternalLink } from "lucide-react";
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
      { title: "Gujarat Intrusion Heatmap — AgriShield AI" },
      {
        name: "description",
        content:
          "District-level animal intrusion risk map for Gujarat with high, medium and low risk zones.",
      },
      { property: "og:title", content: "Gujarat Intrusion Heatmap — AgriShield AI" },
      {
        property: "og:description",
        content: "See which districts report the most crop-raiding animal activity.",
      },
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
      title="Risk Heatmap"
      subtitle="Gujarat district intrusion density (live interactive telemetry map)"
    >
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Gujarat map panel */}
        <PanelSection title="Gujarat overview" description="Tap a district marker for details">
          <div className="h-[500px] w-full">
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
                          "size-5.5 rounded-full border-2 border-white shadow-xl transition-all duration-300 hover:scale-125 flex items-center justify-center cursor-pointer",
                          r.risk === "high"
                            ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"
                            : r.risk === "medium"
                              ? "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                              : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]",
                        )}
                      >
                        <span className="size-2 rounded-full bg-white/60 animate-ping" />
                      </div>
                      <MarkerLabel position="bottom">{r.name}</MarkerLabel>
                    </MarkerContent>

                    <MarkerPopup className="w-64 p-0">
                      <div className="relative h-28 overflow-hidden rounded-t-xl bg-[#0e101f]">
                        <img
                          src={details.image}
                          alt={r.name}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute top-2 left-2 z-10">
                          <RiskPill level={r.risk} />
                        </div>
                      </div>

                      <div className="space-y-2 p-3.5 text-left text-xs bg-[#0b0d19]">
                        <div>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                            Intrusion Intensity: {r.detections} Logs
                          </p>
                          <h3 className="text-sm font-bold text-white mt-0.5 leading-tight">
                            {r.name} District
                          </h3>
                        </div>

                        <p className="text-white/60 leading-normal text-[11px] font-light">
                          {details.notes}
                        </p>

                        <div className="flex items-center gap-4 text-[10px] text-white/40 pt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-primary" />
                            {details.uptime}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-primary text-black font-semibold text-[10px] uppercase tracking-wider hover:bg-primary/95"
                            onClick={() => setActive(r.name)}
                          >
                            <Navigation className="size-3 mr-1" />
                            Focus Grid
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-2.5 border-white/10 hover:bg-white/5 hover:text-white"
                            onClick={() => toast.success(`Viewing live telemetry for ${r.name}`)}
                          >
                            <ExternalLink className="size-3" />
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

        {/* Selected details and ranked lists */}
        <div className="flex flex-col gap-4">
          <PanelSection title={selected.name} description="Selected district details">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-display text-2xl font-bold">
                <MapPin className="size-5 text-primary" />
                {selected.detections}
              </span>
              <RiskPill level={selected.risk} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              detections logged in the last 30 days across participating farms.
            </p>
          </PanelSection>

          <PanelSection title="District ranking" description="Sorted by intrusion volume">
            <ul className="space-y-2">
              {[...REGIONS]
                .sort((a, b) => b.detections - a.detections)
                .map((r) => (
                  <li key={r.name}>
                    <button
                      type="button"
                      onClick={() => setActive(r.name)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        active === r.name
                          ? "border-primary/40 bg-primary/10"
                          : "border-border hover:bg-surface/60",
                      )}
                    >
                      <span className="flex-1 font-medium">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.detections}</span>
                      <RiskPill level={r.risk} />
                    </button>
                  </li>
                ))}
            </ul>
          </PanelSection>
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  MapPin, Check, Undo, Trash2, Map as MapIcon, Crosshair, ChevronLeft
} from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/shield-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, MapPolygon, useMapContext } from "@/components/ui/map";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/setup-boundary")({
  head: () => ({
    meta: [
      { title: "Setup Farm Boundary — AgriShield AI" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <SetupBoundaryPage />
    </AuthGuard>
  ),
});

// Helper component to handle map clicks for drawing
function DrawControl({ onPointAdded }: { onPointAdded: (point: [number, number]) => void }) {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: any) => {
      onPointAdded([e.latlng.lat, e.latlng.lng]);
    };

    map.on('click', handleClick);
    // Change cursor to crosshair
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleClick);
      map.getContainer().style.cursor = '';
    };
  }, [map, onPointAdded]);

  return null;
}

// Calculate rough area in acres from coordinates using Shoelace formula on projected coordinates
function calculateAcres(points: [number, number][]): number {
  if (points.length < 4) return 0;
  
  // Convert lat/lng to approximate meters (simplified planar projection for small areas)
  const R = 6378137; // Earth radius in meters
  const rad = Math.PI / 180;
  
  // Calculate relative to the first point
  const refLat = points[0]![0];
  const refLng = points[0]![1];
  
  const meterPoints = points.map(([lat, lng]) => {
    const x = R * (lng - refLng) * rad * Math.cos(refLat * rad);
    const y = R * (lat - refLat) * rad;
    return [x, y];
  });
  
  let area = 0;
  const n = meterPoints.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const p1 = meterPoints[i] as [number, number];
    const p2 = meterPoints[j] as [number, number];
    area += p1[0] * p2[1];
    area -= p2[0] * p1[1];
  }
  area = Math.abs(area) / 2;
  
  // Convert square meters to acres
  return +(area * 0.000247105).toFixed(2);
}

function SetupBoundaryPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAppState();
  
  const [points, setPoints] = useState<[number, number][]>(
    profile.farmBoundary?.coordinates || []
  );
  const [farmName, setFarmName] = useState(profile.farmBoundary?.name || "Main Farm");
  const area = calculateAcres(points);

  const handleUndo = () => {
    setPoints(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleSave = () => {
    if (points.length < 3) {
      toast.error("Invalid Boundary", { description: "Please mark at least 3 points to create a boundary." });
      return;
    }
    if (!farmName.trim()) {
      toast.error("Name Required", { description: "Please enter a name for your farm boundary." });
      return;
    }

    updateProfile({
      farmBoundary: {
        name: farmName,
        coordinates: points,
        area
      }
    });

    toast.success("Boundary Saved", { description: "Farm boundary successfully registered." });
    navigate({ to: "/farm-heatmap" });
  };

  return (
    <div className="flex h-screen bg-[#07111F] text-foreground overflow-hidden">
      
      {/* FULL SCREEN MAP */}
      <div className="flex-1 relative">
        <Map center={[72.5714, 23.0225]} zoom={12}>
          <DrawControl onPointAdded={(pt) => setPoints(prev => [...prev, pt])} />
          {points.length > 0 && (
            <MapPolygon positions={points} color="#A3E635" fillOpacity={0.3} weight={4} />
          )}
          {/* Also draw markers at vertices so user sees points clearly */}
          {/* Note: Leaflet renders polygons, but we could add circle markers if we wanted. For now, the polygon handles rendering. */}
        </Map>

        {/* TOP BAR / BACK BUTTON */}
        <div className="absolute top-6 left-6 z-10 flex gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl bg-[#090b11]/80 backdrop-blur-md border-border text-white hover:bg-white/10 shadow-lg"
            onClick={() => navigate({ to: "/farm-heatmap" })}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="bg-[#090b11]/80 backdrop-blur-md border border-border px-4 py-2 rounded-xl flex items-center shadow-lg">
             <Crosshair className="size-5 text-primary mr-3" />
             <div>
               <h1 className="text-sm font-bold text-white">Boundary Setup</h1>
               <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Interactive GIS Mode</p>
             </div>
          </div>
        </div>

        {/* DRAWING CONTROLS (Floating on Map) */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
          <Button 
            variant="outline"
            className="bg-[#090b11]/80 backdrop-blur-md border border-border text-white hover:bg-white/10 rounded-xl justify-start px-4 h-10 shadow-lg"
            onClick={handleUndo}
            disabled={points.length === 0}
          >
            <Undo className="size-4 mr-2" />
            Undo Point
          </Button>
          <Button 
            variant="outline"
            className="bg-[#090b11]/80 backdrop-blur-md border border-destructive/50 text-destructive hover:bg-destructive/10 rounded-xl justify-start px-4 h-10 shadow-lg"
            onClick={handleClear}
            disabled={points.length === 0}
          >
            <Trash2 className="size-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE PANEL (Details) */}
      <div className="w-[360px] shrink-0 border-l border-white/10 bg-sidebar/95 backdrop-blur-3xl shadow-2xl z-20 flex flex-col">
        <div className="p-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <MapIcon className="size-6 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-1">Farm Boundary</h2>
          <p className="text-sm text-muted-foreground font-medium">Click on the map to drop boundary pins around your field perimeter.</p>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Farm Name</label>
            <Input 
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="bg-black/20 border-white/10 h-12 rounded-xl text-base font-bold placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
              placeholder="e.g. North Fields"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Calculated Metrics</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-white/10 bg-black/20 text-center">
                <p className="text-2xl font-display font-bold text-white">{points.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Pins</p>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-black/20 text-center">
                <p className="text-2xl font-display font-bold text-primary">{area}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Acres</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <h4 className="text-sm font-bold text-primary mb-1 flex items-center">
              <MapPin className="size-4 mr-2" />
              Draw Instructions
            </h4>
            <ul className="text-xs font-medium text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Click to drop a boundary pin.</li>
              <li>Pins automatically connect in order.</li>
              <li>Minimum 4 pins required to form an area.</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 rounded-xl font-bold border-white/10 hover:bg-white/5"
            onClick={() => navigate({ to: "/farm-heatmap" })}
          >
            Cancel
          </Button>
          <Button 
            className="rounded-full px-8 shadow-xl font-bold bg-primary text-black hover:bg-primary/90"
            disabled={points.length < 4 || !farmName}
            onClick={handleSave}
          >
            <Check className="mr-2 size-4" />
            Save Farm
          </Button>
        </div>
      </div>

    </div>
  );
}

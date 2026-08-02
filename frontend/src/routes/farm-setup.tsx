import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import { ArrowLeft, Save, Trash2, Undo2, Map as MapIcon, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/farm-setup")({
  component: FarmSetupPage,
});

type LatLng = { lat: number; lng: number };

function MapEvents({ onMapClick }: { onMapClick: (pt: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Approximate calculation for demonstration
function calculateAreaSquareMeters(points: LatLng[]) {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const p1 = points[i];
    const p2 = points[j];
    area += (p2.lng - p1.lng) * (p2.lat + p1.lat);
  }
  // Rough conversion factor for lat/lng to sq meters near equator, just for demo UX
  return Math.abs(area * 10000000000 / 2);
}

function FarmSetupPage() {
  const navigate = useNavigate();
  const { profile, farmBoundary, setFarmBoundary } = useAppState();
  const [points, setPoints] = useState<LatLng[]>(farmBoundary || []);

  const handleMapClick = (pt: LatLng) => {
    setPoints((prev) => [...prev, pt]);
  };

  const undoPoint = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const handleSave = () => {
    if (points.length < 3) {
      toast.error("Please draw a valid polygon with at least 3 points.");
      return;
    }
    setFarmBoundary(points);
    toast.success("Farm Saved Successfully", {
      description: "Boundary has been defined and securely saved.",
    });
    navigate({ to: "/heatmap" });
  };

  const area = useMemo(() => calculateAreaSquareMeters(points), [points]);
  const areaFormatted = area > 10000 
    ? (area / 10000).toFixed(2) + " Hectares" 
    : area.toFixed(0) + " sq. meters";

  // Default to a central India/Gujarat view if no points exist
  const defaultCenter = points.length > 0 
    ? [points[0].lat, points[0].lng] 
    : [23.0225, 72.5714];

  return (
    <div className="relative h-screen w-full bg-surface overflow-hidden flex flex-col">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="pointer-events-auto bg-white/90 backdrop-blur-md border-border shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all rounded-xl"
            onClick={() => navigate({ to: "/heatmap" })}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          
          <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md border border-border shadow-lg rounded-xl px-4 py-2 font-medium text-sm text-foreground">
            <HelpCircle className="size-4 text-primary" />
            Click on the map to draw your farm boundary
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full z-0">
        <MapContainer 
          center={defaultCenter as [number, number]} 
          zoom={13} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onMapClick={handleMapClick} />
          {points.length > 0 && (
            <Polygon 
              positions={points} 
              pathOptions={{ 
                color: 'hsl(var(--primary))', 
                fillColor: 'hsl(var(--primary))', 
                fillOpacity: 0.3,
                weight: 3,
                dashArray: '5, 5'
              }} 
            />
          )}
        </MapContainer>
      </div>

      {/* Bottom Floating Card */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-[600px] px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-[2rem] p-6 animate-in slide-in-from-bottom-8 duration-500">
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapIcon className="size-5 text-primary" />
                <h2 className="text-xl font-display font-bold text-foreground">Farm Boundary Setup</h2>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{profile.farmName} • {profile.village}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-xl border-border hover:bg-surface hover:text-destructive transition-colors"
                onClick={clearPoints}
                disabled={points.length === 0}
                title="Clear Boundary"
              >
                <Trash2 className="size-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-xl border-border hover:bg-surface transition-colors"
                onClick={undoPoint}
                disabled={points.length === 0}
                title="Undo Last Point"
              >
                <Undo2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-surface/50 border border-border/30 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Calculated Area</p>
              <p className="text-lg font-bold text-foreground tabular-nums">{areaFormatted}</p>
            </div>
            <div className="bg-surface/50 border border-border/30 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Boundary Points</p>
              <p className="text-lg font-bold text-foreground tabular-nums">{points.length} <span className="text-sm font-medium text-muted-foreground">points</span></p>
            </div>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
            onClick={handleSave}
            disabled={points.length < 3}
          >
            <Save className="mr-2 size-5" />
            {points.length < 3 ? "Click at least 3 points to save" : "Save Farm Boundary"}
          </Button>

        </div>
      </div>

    </div>
  );
}

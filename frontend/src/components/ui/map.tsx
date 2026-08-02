import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { X } from "lucide-react";

interface MapContextType {
  map: any;
  L: any;
  activeMarker: string | number | null;
  setActiveMarker: (id: string | number | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function useMapContext() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMapContext must be used within a Map");
  return context;
}

// Dynamically inject Leaflet CSS & JS from CDN
function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).L && (window as any).L.heatLayer) {
      resolve((window as any).L);
      return;
    }

    // Insert stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Insert JS script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      // Once Leaflet is loaded, load Leaflet.heat
      const heatScript = document.createElement("script");
      heatScript.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
      heatScript.onload = () => resolve((window as any).L);
      heatScript.onerror = reject;
      document.head.appendChild(heatScript);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Custom CSS to strip default Leaflet styling and integrate dark-themed look
const leafletStyleOverrides = `
  .custom-leaflet-marker-wrapper {
    background: transparent !important;
    border: none !important;
  }
  .leaflet-popup-content-wrapper {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    border: none !important;
  }
  .leaflet-popup-content {
    margin: 0 !important;
    padding: 0 !important;
    line-height: inherit !important;
    width: 256px !important;
  }
  .leaflet-popup-tip-container {
    display: none !important;
  }
  .leaflet-container {
    font-family: inherit !important;
  }
`;

export function Map({
  children,
  center = [71.7, 22.4], // [Lng, Lat]
  zoom = 8,
}: {
  children: React.ReactNode;
  center?: [number, number];
  zoom?: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leaflet, setLeaflet] = useState<{ L: any; map: any } | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | number | null>(null);

  // Load CDN scripts and configure map instance
  useEffect(() => {
    if (mapInstanceRef.current) return; // Prevent double initialization

    loadLeaflet().then((L) => {
      if (!mapRef.current) return;

      // Note: Leaflet expects [Lat, Lng] coordinates
      const mapInstance = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([center[1], center[0]], zoom);

      mapInstanceRef.current = mapInstance;

      // Load light-theme tile layers from CartoDB (based on OpenStreetMap data)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
      }).addTo(mapInstance);

      setLeaflet({ L, map: mapInstance });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Intentionally only run on mount

  // React to center/zoom changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView([center[1], center[0]], zoom);
    }
  }, [center, zoom]);

  return (
    <MapContext.Provider
      value={{
        map: leaflet?.map,
        L: leaflet?.L,
        activeMarker,
        setActiveMarker,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: leafletStyleOverrides }} />
      <div className="relative w-full h-full rounded-xl border border-border overflow-hidden bg-slate-50 min-h-[500px]">
        <div ref={mapRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

        {/* Mount children once Leaflet is initialized */}
        {leaflet && children}
      </div>
    </MapContext.Provider>
  );
}

interface MapMarkerProps {
  children: React.ReactNode;
  longitude: number;
  latitude: number;
}

export function MapMarker({ children, longitude, latitude }: MapMarkerProps) {
  const context = useContext(MapContext);
  if (!context) return null; // Wait until Leaflet map context is active

  const { L, map, activeMarker, setActiveMarker } = context;
  const markerRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const popupRootRef = useRef<any>(null);

  const markerId = `${latitude}-${longitude}`;
  const isActive = activeMarker === markerId;

  // Separate Content and Popup children
  const markerContent = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === MarkerContent,
  );

  const markerPopup = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === MarkerPopup,
  );

  // Sync state selection with active status
  useEffect(() => {
    if (!markerRef.current || !map) return;
    if (isActive) {
      markerRef.current.openPopup();
    } else {
      markerRef.current.closePopup();
    }
  }, [isActive, map]);

  useEffect(() => {
    if (!map || !L) return;

    // Create marker container DOM element
    const container = document.createElement("div");
    const root = createRoot(container);
    rootRef.current = root;

    // Render content
    root.render(<>{markerContent}</>);

    const customIcon = L.divIcon({
      html: container,
      className: "custom-leaflet-marker-wrapper",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Create Leaflet Marker
    const marker = L.marker([latitude, longitude], {
      icon: customIcon,
      bubblingMouseEvents: true,
    }).addTo(map);

    markerRef.current = marker;

    // Handle marker click events
    marker.on("click", (e: any) => {
      L.DomEvent.stopPropagation(e);
      setActiveMarker(isActive ? null : markerId);
    });

    // Attach custom popup
    if (markerPopup) {
      const popupContainer = document.createElement("div");
      const popupRoot = createRoot(popupContainer);
      popupRootRef.current = popupRoot;
      popupRoot.render(<>{markerPopup}</>);

      marker.bindPopup(popupContainer, {
        className: "custom-leaflet-popup",
        closeButton: false,
        offset: [0, -12],
        minWidth: 256,
        maxWidth: 256,
      });

      // Synchronize closing the popup via Leaflet hooks back to React state
      map.on("popupclose", (e: any) => {
        if (e.popup._source === marker) {
          setActiveMarker(null);
        }
      });
    }

    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      if (rootRef.current) {
        rootRef.current.unmount();
      }
      if (popupRootRef.current) {
        popupRootRef.current.unmount();
      }
    };
  }, [map, L, longitude, latitude]);

  return null; // The DOM element is entirely mounted and managed inside the Leaflet layer
}

export function MarkerContent({ children }: { children: React.ReactNode }) {
  return <div className="relative pointer-events-auto">{children}</div>;
}

export function MarkerLabel({
  children,
  position = "bottom",
  className = "",
}: {
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
  };

  return (
    <span
      className={`absolute whitespace-nowrap text-[10px] font-mono font-bold tracking-wider text-emerald-400 bg-[#070913]/90 border border-white/10 px-2 py-0.5 rounded shadow-lg pointer-events-none ${posClasses[position]} ${className}`}
    >
      {children}
    </span>
  );
}

export function MarkerPopup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(MapContext);

  return (
    <div
      className={`relative rounded-xl border border-white/15 bg-[#0a0d1a] text-white shadow-2xl p-0 overflow-hidden w-64 ${className || ""}`}
      style={{
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), 0 0 15px rgba(16,185,129,0.1)",
      }}
    >
      {/* Close button */}
      <button
        onClick={() => context?.setActiveMarker(null)}
        className="absolute right-2.5 top-2.5 z-40 bg-black/60 hover:bg-black/80 text-white/70 hover:text-white rounded-full p-1 border border-white/10 transition-colors"
        aria-label="Close details"
      >
        <X className="size-3" />
      </button>

      {children}
    </div>
  );
}

export function MapPolygon({
  positions,
  color = "#A3E635",
  fillOpacity = 0.2,
  weight = 3,
  className,
}: {
  positions: [number, number][]; // Array of [Lat, Lng]
  color?: string;
  fillOpacity?: number;
  weight?: number;
  className?: string;
}) {
  const { L, map } = useMapContext();
  const polygonRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !L) return;

    // Remove existing polygon if any
    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
    }

    if (positions.length > 0) {
      polygonRef.current = L.polygon(positions, {
        color,
        fillOpacity,
        weight,
        dashArray: "5, 10", // slightly dashed line for boundary look
        lineCap: "round",
        lineJoin: "round",
        className,
      }).addTo(map);
    }

    return () => {
      if (polygonRef.current && map) {
        map.removeLayer(polygonRef.current);
      }
    };
  }, [map, L, positions, color, fillOpacity, weight]);

  return null;
}

export function MapHeatmapLayer({
  points,
  radius = 25,
  blur = 15,
  maxZoom = 17,
  gradient = { 0.4: 'lime', 0.6: 'yellow', 1.0: 'red' }
}: {
  points: [number, number, number][]; // [lat, lng, intensity]
  radius?: number;
  blur?: number;
  maxZoom?: number;
  gradient?: Record<number, string>;
}) {
  const { L, map } = useMapContext();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !L || !L.heatLayer) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    if (points.length > 0) {
      heatLayerRef.current = L.heatLayer(points, {
        radius,
        blur,
        maxZoom,
        gradient
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, L, points, radius, blur, maxZoom, gradient]);

  return null;
}

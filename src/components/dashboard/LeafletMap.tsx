"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { GeoCasePoint } from "@/types/apiTypes";

interface LeafletMapProps {
  cases?: GeoCasePoint[];
  onSelectCase?: (c: GeoCasePoint) => void;
  selectedCaseId?: number | null;
  flyToCenter?: [number, number] | null;
  zoomLevel?: number;
  tileTheme?: "light" | "dark" | "satellite";
  showHotspotRings?: boolean;
}

const KARNATAKA_CENTER: LatLngExpression = [15.3173, 75.7139];

// Component to handle smooth flyTo panning
function MapFlyController({
  center,
  zoom,
}: {
  center?: [number, number] | null;
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 11, {
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({
  cases = [],
  onSelectCase,
  selectedCaseId,
  flyToCenter,
  zoomLevel = 7,
  tileTheme = "dark",
  showHotspotRings = true,
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-xs font-mono">INITIALIZING TACTICAL GIS MATRIX...</span>
        </div>
      </div>
    );
  }

  const getMarkerColor = (crimeName: string, statusId: number) => {
    if (statusId === 9903) return "#10b981"; // Closed / Green
    if (statusId === 9902) return "#38bdf8"; // Charge sheeted / Light Blue
    const lower = (crimeName || "").toLowerCase();
    if (
      lower.includes("murder") ||
      lower.includes("pocso") ||
      lower.includes("rape") ||
      lower.includes("dacoity")
    ) {
      return "#ef4444"; // Heinous / Red
    }
    if (
      lower.includes("theft") ||
      lower.includes("burglary") ||
      lower.includes("robbery") ||
      lower.includes("hurt")
    ) {
      return "#f59e0b"; // Property / Amber
    }
    if (lower.includes("cyber") || lower.includes("special")) {
      return "#a855f7"; // Cyber / Purple
    }
    return "#3b82f6";
  };

  const tileUrl =
    tileTheme === "dark"
      ? "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      : tileTheme === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={flyToCenter || KARNATAKA_CENTER}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <MapFlyController center={flyToCenter} zoom={zoomLevel} />
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; ESRI &copy; OpenStreetMap | KSP GIS'
          url={tileUrl}
        />
        {tileTheme === "dark" && (
          <TileLayer
            attribution=""
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Dynamic Scan Radar Circle over Target Zone */}
        {flyToCenter && flyToCenter[0] && flyToCenter[1] && (
          <>
            <Circle
              center={flyToCenter}
              radius={16000}
              pathOptions={{
                color: "#38bdf8",
                fillColor: "#38bdf8",
                fillOpacity: 0.15,
                weight: 2,
                dashArray: "6, 8",
              }}
            />
            <Circle
              center={flyToCenter}
              radius={8000}
              pathOptions={{
                color: "#60a5fa",
                fillColor: "#60a5fa",
                fillOpacity: 0.25,
                weight: 1.5,
              }}
            />
          </>
        )}

        {/* Hotspot Radar Density Rings */}
        {showHotspotRings && (
          <>
            <Circle
              center={[12.9716, 77.5946]}
              radius={22000}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: "4, 6",
              }}
            />
            <Circle
              center={[15.3647, 75.124]}
              radius={15000}
              pathOptions={{
                color: "#f59e0b",
                fillColor: "#f59e0b",
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: "4, 6",
              }}
            />
            <Circle
              center={[12.2958, 76.6394]}
              radius={14000}
              pathOptions={{
                color: "#a855f7",
                fillColor: "#a855f7",
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: "4, 6",
              }}
            />
          </>
        )}

        {cases.map((c) => {
          if (!c.latitude || !c.longitude || isNaN(c.latitude) || isNaN(c.longitude)) return null;
          const color = getMarkerColor(c.crime, c.statusId);
          const isSelected = selectedCaseId === c.caseId;

          return (
            <CircleMarker
              key={c.caseId}
              center={[c.latitude, c.longitude]}
              radius={isSelected ? 12 : 7}
              pathOptions={{
                color: isSelected ? "#ffffff" : color,
                fillColor: color,
                fillOpacity: isSelected ? 1 : 0.85,
                weight: isSelected ? 3.5 : 1.5,
              }}
              eventHandlers={{
                click: () => {
                  if (onSelectCase) {
                    onSelectCase(c);
                  }
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <div className="text-xs font-semibold p-1">
                  <p className="text-slate-900 font-bold">{c.crime}</p>
                  <p className="text-slate-500 font-mono text-[10px]">{c.crimeNo || `Case #${c.caseId}`}</p>
                  <p className="text-blue-600 text-[10px]">{c.districtName || c.unitName}</p>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
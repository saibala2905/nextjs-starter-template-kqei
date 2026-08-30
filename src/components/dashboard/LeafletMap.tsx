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
import type { SentinelProtocol } from "@/services/mlMonitoringService";

interface LeafletMapProps {
  cases?: GeoCasePoint[];
  protocols?: SentinelProtocol[];
  onSelectCase?: (c: GeoCasePoint) => void;
  selectedCaseId?: number | null;
  flyToCenter?: [number, number] | null;
  zoomLevel?: number;
  tileTheme?: "light" | "dark" | "satellite";
  showHotspotRings?: boolean;
}

const KARNATAKA_CENTER: LatLngExpression = [15.3173, 75.7139];

const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Bengaluru city": [12.9716, 77.5946],
  "Bengaluru District": [13.0827, 77.5877],
  "Bengaluru South": [12.8975, 77.5975],
  "Mysuru District": [12.2958, 76.6394],
  "Mysuru City": [12.3051, 76.6551],
  "Belagavi Dist": [15.8497, 74.4977],
  "Belagavi City": [15.8600, 74.5100],
  "Dharwad": [15.4589, 75.0078],
  "Hubballi Dharwad City": [15.3647, 75.1240],
  "Mangalooru City": [12.9141, 74.8560],
  "Dakshina Kannada": [12.8391, 75.0414],
  "Kalaburagi": [17.3297, 76.8343],
  "Kalaburagi City": [17.3400, 76.8400],
  "Shivamogga": [13.9299, 75.5681],
  "Tumakuru": [13.3409, 77.1010],
  "Vijayapur": [16.8302, 75.7100],
  "Ballari": [15.1394, 76.9214],
  "Udupi": [13.3409, 74.7421],
  "Uttara Kannada": [14.7924, 74.4348],
  "Yadgir": [16.7644, 77.1378],
  "Chitradurga": [14.2251, 76.3980],
  "Hassan": [13.0033, 76.1004],
  "Mandya": [12.5238, 76.8970],
  "Raichur": [16.2076, 77.3463],
  "Davanagere": [14.4644, 75.9218],
  "Chikkamagaluru": [13.3161, 75.7720],
  "Chickballapura": [13.4355, 77.7315],
  "Bagalkot": [16.1850, 75.6960],
};

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
  protocols = [],
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

        {/* Active Sentinel Protocol Geo-Fence Perimeters */}
        {protocols.map((p) => {
          if (p.status === "paused") return null;
          const isBreached = p.status === "breached";
          const color = isBreached ? "#ef4444" : p.severity === "elevated" ? "#f59e0b" : "#06b6d4";

          return (
            <div key={p.id}>
              {p.targetDistricts.map((dName) => {
                const coords = DISTRICT_COORDS[dName];
                if (!coords) return null;

                return (
                  <Circle
                    key={`${p.id}-${dName}`}
                    center={coords}
                    radius={isBreached ? 24000 : 18000}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: isBreached ? 0.18 : 0.08,
                      weight: isBreached ? 2.5 : 1.5,
                      dashArray: isBreached ? "5, 5" : "8, 6",
                    }}
                  >
                    <Tooltip direction="top" opacity={0.95}>
                      <div className="text-xs p-1">
                        <p className="font-black text-slate-900 flex items-center gap-1">
                          <span>{p.name}</span>
                          <span className={`px-1 rounded text-[9px] font-bold ${isBreached ? "bg-red-100 text-red-700" : "bg-cyan-100 text-cyan-800"}`}>
                            {isBreached ? "BREACHED" : "SENTINEL ACTIVE"}
                          </span>
                        </p>
                        <p className="text-slate-600 text-[10px] mt-0.5">
                          Monitored Vector: <strong>{p.crimeHead}</strong> ({p.currentValue} / {p.threshold})
                        </p>
                      </div>
                    </Tooltip>
                  </Circle>
                );
              })}
            </div>
          );
        })}

        {/* Hotspot Radar Density Rings */}
        {showHotspotRings && (
          <>
            <Circle
              center={[12.9716, 77.5946]}
              radius={22000}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.10,
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
                fillOpacity: 0.10,
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
                fillOpacity: 0.10,
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
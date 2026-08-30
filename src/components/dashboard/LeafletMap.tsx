"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, ZoomControl } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { GeoCasePoint } from "@/types/apiTypes";

interface LeafletMapProps {
  cases?: GeoCasePoint[];
}

const KARNATAKA_CENTER: LatLngExpression = [15.3173, 75.7139];

export default function LeafletMap({ cases = [] }: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
        <span className="text-sm font-medium">Initializing Karnataka GIS Canvas...</span>
      </div>
    );
  }

  const getMarkerColor = (crimeName: string, statusId: number) => {
    if (statusId === 9903) return "#10b981"; // Closed / Green
    if (statusId === 9902) return "#3b82f6"; // Charge sheeted / Blue
    const lower = (crimeName || "").toLowerCase();
    if (lower.includes("murder") || lower.includes("pocso") || lower.includes("rape") || lower.includes("dacoity")) {
      return "#ef4444"; // Heinous / Red
    }
    if (lower.includes("theft") || lower.includes("burglary") || lower.includes("robbery")) {
      return "#f59e0b"; // Property / Amber
    }
    if (lower.includes("cyber")) {
      return "#8b5cf6"; // Cyber / Purple
    }
    return "#64748b";
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={KARNATAKA_CENTER}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | KSP GIS'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cases.map((c) => {
          if (!c.latitude || !c.longitude || isNaN(c.latitude) || isNaN(c.longitude)) return null;
          const color = getMarkerColor(c.crime, c.statusId);

          return (
            <CircleMarker
              key={c.caseId}
              center={[c.latitude, c.longitude]}
              radius={6}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 1.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
                <div className="text-xs font-semibold">
                  <p className="text-slate-900">{c.crime}</p>
                  <p className="text-slate-500 font-normal">{c.districtName || c.unitName}</p>
                </div>
              </Tooltip>

              <Popup>
                <div className="p-1 max-w-xs space-y-1.5 text-xs">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-bold text-blue-700">{c.crimeNo || `Case #${c.caseId}`}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                      {c.statusName}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{c.crime}</p>
                  <p className="text-slate-600">
                    <strong>Jurisdiction:</strong> {c.unitName} ({c.districtName})
                  </p>
                  <p className="text-slate-600">
                    <strong>Registered:</strong> {c.registeredDate}
                  </p>
                  {c.briefFacts && (
                    <p className="text-slate-500 text-[11px] italic line-clamp-3 bg-slate-50 p-1.5 rounded">
                      &quot;{c.briefFacts}&quot;
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute top-4 right-4 z-1000 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur text-xs space-y-1.5">
        <p className="font-bold text-slate-900 mb-1 flex items-center justify-between">
          <span>Incident Density</span>
          <span className="text-[10px] font-normal text-slate-500">{cases.length} Points</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span className="text-slate-700">Heinous / Violent Crimes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-700">Property / Theft</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
          <span className="text-slate-700">Cyber / Special Laws</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-700">Closed / Chargesheeted</span>
        </div>
      </div>
    </div>
  );
}
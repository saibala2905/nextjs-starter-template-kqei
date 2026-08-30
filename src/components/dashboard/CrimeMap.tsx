"use client";

import dynamic from "next/dynamic";
import { MapPinned, RefreshCw } from "lucide-react";
import type { GeoCasePoint } from "@/types/apiTypes";

const Map = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Loading Karnataka Geospatial Canvas...</span>
      </div>
    </div>
  ),
});

interface CrimeMapProps {
  cases?: GeoCasePoint[];
  loading?: boolean;
  onRefresh?: () => void;
}

export default function CrimeMap({ cases = [], loading = false, onRefresh }: CrimeMapProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5">
            <MapPinned className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Geospatial Crime Intelligence</h2>
            <p className="text-xs text-slate-500">
              Interactive statewide crime density mapping &amp; district-level FIR coordinates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Live GIS ({cases.length} FIR Points)</span>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              title="Refresh Map Points"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Sync</span>
            </button>
          )}
        </div>
      </div>

      <div className="h-[520px] w-full">
        <Map cases={cases} />
      </div>
    </section>
  );
}
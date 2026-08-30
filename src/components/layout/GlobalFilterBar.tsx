"use client";

import { useEffect, useState } from "react";
import { Filter, Calendar, MapPin, Layers, RotateCcw } from "lucide-react";
import { kspApi } from "@/services/kspApi";
import type { GeoDistrict, CrimeSummaryItem } from "@/types/apiTypes";

interface GlobalFilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  districtId: string;
  crimeMinorHeadId: string;
  dateRange: string;
  from?: string;
  to?: string;
}

export default function GlobalFilterBar({ onFilterChange }: GlobalFilterBarProps) {
  const [districts, setDistricts] = useState<GeoDistrict[]>([]);
  const [crimes, setCrimes] = useState<CrimeSummaryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    districtId: "all",
    crimeMinorHeadId: "all",
    dateRange: "all",
  });

  useEffect(() => {
    async function loadMasterOptions() {
      try {
        setLoading(true);
        const [districtData, crimeData] = await Promise.all([
          kspApi.getGeoDistricts().catch(() => []),
          kspApi.getCrimeSummary().catch(() => []),
        ]);
        setDistricts(districtData);
        setCrimes(crimeData);
      } catch (err) {
        console.error("Error loading filter bar options:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMasterOptions();
  }, []);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = { ...filters, districtId: e.target.value };
    setFilters(next);
    onFilterChange?.(next);
  };

  const handleCrimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = { ...filters, crimeMinorHeadId: e.target.value };
    setFilters(next);
    onFilterChange?.(next);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let from: string | undefined;
    let to: string | undefined;

    if (val === "may") {
      from = "2026-05-01";
      to = "2026-05-31";
    } else if (val === "june") {
      from = "2026-06-01";
      to = "2026-06-30";
    } else if (val === "july") {
      from = "2026-07-01";
      to = "2026-07-31";
    }

    const next = { ...filters, dateRange: val, from, to };
    setFilters(next);
    onFilterChange?.(next);
  };

  const handleReset = () => {
    const resetState: FilterState = {
      districtId: "all",
      crimeMinorHeadId: "all",
      dateRange: "all",
    };
    setFilters(resetState);
    onFilterChange?.(resetState);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
          <Filter size={14} className="text-blue-600" />
          <span>Active Context:</span>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          <select
            value={filters.districtId}
            onChange={handleDistrictChange}
            disabled={loading}
            className="bg-transparent font-medium text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Karnataka Districts ({districts.length || 38})</option>
            {districts.map((d) => (
              <option key={d.districtId} value={String(d.districtId)}>
                {d.districtName} ({d.totalCases} cases)
              </option>
            ))}
          </select>
        </div>

        {/* Crime Head Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs">
          <Layers size={14} className="text-slate-400 shrink-0" />
          <select
            value={filters.crimeMinorHeadId}
            onChange={handleCrimeChange}
            disabled={loading}
            className="bg-transparent font-medium text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Crime Types ({crimes.length || 18})</option>
            {crimes.map((c) => (
              <option key={c.crimeMinorHeadId} value={String(c.crimeMinorHeadId)}>
                {c.crime} ({c.count})
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs">
          <Calendar size={14} className="text-slate-400 shrink-0" />
          <select
            value={filters.dateRange}
            onChange={handleDateChange}
            className="bg-transparent font-medium text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Time (May - July 2026)</option>
            <option value="july">July 2026 (Recent)</option>
            <option value="june">June 2026</option>
            <option value="may">May 2026 (Baseline)</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
      >
        <RotateCcw size={12} />
        <span>Reset</span>
      </button>
    </div>
  );
}

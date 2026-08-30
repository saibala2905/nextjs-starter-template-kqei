"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Shield,
  BrainCircuit,
  MapPinned,
  ChartColumnIncreasing,
  Crosshair,
  Maximize2,
} from "lucide-react";

import HeroBanner from "@/components/dashboard/HeroBanner";
import KPIGrid from "@/components/dashboard/KPIGrid";
import SituationAssessment from "@/components/dashboard/SituationAssessment";
import LiveAlertFeed from "@/components/dashboard/LiveAlertFeed";
import CrimeMap from "@/components/dashboard/CrimeMap";
import CrimeTrendAnalytics from "@/components/dashboard/CrimeTrendAnalytics";
import TacticalMapHUD from "@/components/dashboard/TacticalMapHUD";
import GlobalFilterBar, { FilterState } from "@/components/layout/GlobalFilterBar";
import SectionHeader from "@/components/ui/SectionHeader";

import { kspApi } from "@/services/kspApi";
import type {
  DashboardOverviewResponse,
  GeoCasePoint,
  DashboardKPISummary,
} from "@/types/apiTypes";

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "hud">("grid");
  const [overview, setOverview] = useState<DashboardOverviewResponse | null>(null);
  const [geoCases, setGeoCases] = useState<GeoCasePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dynamic filtered KPIs
  const [filteredKPIs, setFilteredKPIs] = useState<DashboardKPISummary | null>(null);

  const [sections, setSections] = useState({
    overview: true,
    assessment: true,
    intelligence: true,
    analytics: true,
  });

  const toggle = (key: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewData, geoData] = await Promise.all([
        kspApi.getDashboardOverview().catch((err) => {
          console.error("Dashboard overview error:", err);
          return null;
        }),
        kspApi.getGeoCases({ limit: 250 }).catch((err) => {
          console.error("Geo cases error:", err);
          return [];
        }),
      ]);

      if (overviewData) {
        setOverview(overviewData);
        setFilteredKPIs(overviewData.kpis);
      }
      setGeoCases(geoData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = async (filters: FilterState) => {
    try {
      setRefreshing(true);
      const params: Record<string, string | number> = {};
      if (filters.districtId !== "all") params.districtId = Number(filters.districtId);
      if (filters.crimeMinorHeadId !== "all") params.crimeMinorHeadId = Number(filters.crimeMinorHeadId);
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const [kpiRes, geoRes] = await Promise.all([
        kspApi.getDashboardKPIs(params).catch(() => null),
        kspApi.getGeoCases({ ...params, limit: 250 }).catch(() => []),
      ]);

      if (kpiRes) {
        setFilteredKPIs({
          totalCases: kpiRes.totalCases,
          activeCases: kpiRes.activeCases,
          chargeSheetedCases: kpiRes.chargeSheeted,
          closedCases: kpiRes.closed,
          pendingReviewCases: overview?.kpis?.pendingReviewCases || 36,
          chargesheetRate: kpiRes.totalCases > 0 ? Math.round((kpiRes.chargeSheeted / kpiRes.totalCases) * 1000) / 10 : 0,
        });
      }
      setGeoCases(geoRes);
    } catch (err) {
      console.error("Filter change error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // If in Tactical HUD Mode, render the immersive game-style overlay map
  if (viewMode === "hud") {
    return (
      <TacticalMapHUD
        overview={overview}
        geoCases={geoCases}
        kpis={filteredKPIs || overview?.kpis || null}
        onExitHUD={() => setViewMode("grid")}
      />
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Top HUD Mode Switcher Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/20 p-2.5 border border-blue-400/30">
            <Crosshair size={20} className="text-blue-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide uppercase flex items-center gap-2">
              <span>Tactical War Room &amp; Visual HUD Mode</span>
              <span className="rounded-full bg-cyan-500/25 px-2.5 py-0.5 text-[10px] font-bold text-cyan-200 border border-cyan-400/30">
                Interactive Command HUD
              </span>
            </h2>
            <p className="text-xs text-blue-200/80 mt-0.5">
              Full-screen geospatial intelligence with floating glassmorphic analytics, real-time threat radar, and FIR inspection cards
            </p>
          </div>
        </div>

        <button
          onClick={() => setViewMode("hud")}
          className="flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-4 py-2 text-xs font-black text-slate-950 transition shadow-lg cursor-pointer shrink-0"
        >
          <Maximize2 size={14} />
          <span>Launch Tactical HUD Mode</span>
        </button>
      </div>

      {/* Global Filter Bar */}
      <GlobalFilterBar onFilterChange={handleFilterChange} />

      {/* ====================================================== */}
      {/* 1. Operational Overview */}
      {/* ====================================================== */}
      <section>
        <SectionHeader
          icon={<Shield size={20} />}
          title="Operational Command Overview"
          description="Statewide real-time operational intelligence and active caseload signals."
          badges={[
            { label: "Catalyst Data Store", color: "blue" },
            { label: `${filteredKPIs?.totalCases || 1499} Total FIRs`, color: "purple" },
            { label: "Live System", color: "green" },
          ]}
          open={sections.overview}
          onToggle={() => toggle("overview")}
        />

        {sections.overview && (
          <div className="space-y-6">
            <HeroBanner />
            <KPIGrid kpis={filteredKPIs || overview?.kpis} loading={loading || refreshing} />
          </div>
        )}
      </section>

      {/* ====================================================== */}
      {/* 2. AI Situation Assessment */}
      {/* ====================================================== */}
      <section>
        <SectionHeader
          icon={<BrainCircuit size={20} />}
          title="AI Situation Assessment & Attention Queue"
          description="Automated threat level analysis, risk indexing, and real-time supervisor alerts."
          badges={[
            { label: "Threat: LEVEL 3", color: "red" },
            { label: "Risk: 78.4", color: "orange" },
            { label: "Live Alerts", color: "purple" },
          ]}
          open={sections.assessment}
          onToggle={() => toggle("assessment")}
        />

        {sections.assessment && (
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <SituationAssessment overview={overview} />
            </div>

            <div>
              <LiveAlertFeed />
            </div>
          </div>
        )}
      </section>

      {/* ====================================================== */}
      {/* 3. Geospatial Crime Intelligence */}
      {/* ====================================================== */}
      <section>
        <SectionHeader
          icon={<MapPinned size={20} />}
          title="Geospatial Crime Intelligence (GIS)"
          description="Interactive statewide coordinates with crime classification color coding and FIR popups."
          badges={[
            { label: `${geoCases.length} Geocoded Cases`, color: "blue" },
            { label: "38 Districts", color: "purple" },
            { label: "Interactive GIS", color: "green" },
          ]}
          open={sections.intelligence}
          onToggle={() => toggle("intelligence")}
        />

        {sections.intelligence && (
          <div className="space-y-3">
            <div className="flex items-center justify-end">
              <button
                onClick={() => setViewMode("hud")}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs cursor-pointer"
              >
                <Maximize2 size={13} />
                <span>Open in Tactical HUD Fullscreen</span>
              </button>
            </div>
            <CrimeMap cases={geoCases} loading={loading || refreshing} onRefresh={loadData} />
          </div>
        )}
      </section>

      {/* ====================================================== */}
      {/* 4. Crime Analytics */}
      {/* ====================================================== */}
      <section>
        <SectionHeader
          icon={<ChartColumnIncreasing size={20} />}
          title="Crime Velocity & Classification Analytics"
          description="Monthly registration trends and subhead crime distributions from Catalyst ZCQL queries."
          badges={[
            { label: "May - July 2026", color: "purple" },
            { label: "18 Crime Subheads", color: "blue" },
            { label: "ZCQL Engine", color: "green" },
          ]}
          open={sections.analytics}
          onToggle={() => toggle("analytics")}
        />

        {sections.analytics && (
          <CrimeTrendAnalytics
            monthlyMovement={overview?.crimeMovement}
            topCrimes={overview?.topCrimeCategories}
          />
        )}
      </section>
    </div>
  );
}
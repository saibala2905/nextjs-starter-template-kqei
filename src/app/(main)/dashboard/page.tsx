"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  BrainCircuit,
  MapPinned,
  ChartColumnIncreasing,
  Crosshair,
  Maximize2,
  ShieldAlert,
  ArrowRight,
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
          console.error("Geo points fetch error:", err);
          return [] as GeoCasePoint[];
        }),
      ]);

      if (overviewData) {
        setOverview(overviewData);
      }
      if (geoData && geoData.length > 0) {
        setGeoCases(geoData);
      }
    } catch (error) {
      console.error("Dashboard load failed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Global Filters change
  const handleFilterChange = useCallback(
    async (filters: FilterState) => {
      try {
        setRefreshing(true);
        const kpiParams: {
          from?: string;
          to?: string;
          districtId?: number;
          unitId?: number;
          crimeMinorHeadId?: number;
          caseStatusId?: number;
        } = {};

        if (filters.from) kpiParams.from = filters.from;
        if (filters.to) kpiParams.to = filters.to;
        if (filters.districtId && filters.districtId !== "all") kpiParams.districtId = Number(filters.districtId);
        if (filters.crimeMinorHeadId && filters.crimeMinorHeadId !== "all") kpiParams.crimeMinorHeadId = Number(filters.crimeMinorHeadId);

        const [kpiRes, geoRes] = await Promise.all([
          kspApi.getDashboardKPIs(kpiParams).catch(() => null),
          kspApi
            .getGeoCases({
              districtId: filters.districtId && filters.districtId !== "all" ? Number(filters.districtId) : undefined,
              crimeMinorHeadId: filters.crimeMinorHeadId && filters.crimeMinorHeadId !== "all" ? Number(filters.crimeMinorHeadId) : undefined,
              limit: 250,
            })
            .catch(() => [] as GeoCasePoint[]),
        ]);

        if (kpiRes) {
          setFilteredKPIs({
            totalCases: kpiRes.totalCases,
            activeCases: kpiRes.activeCases,
            chargeSheetedCases: kpiRes.chargeSheeted,
            closedCases: kpiRes.closed,
            pendingReviewCases: Math.round(kpiRes.activeCases * 0.08),
            chargesheetRate: Math.round((kpiRes.chargeSheeted / Math.max(1, kpiRes.totalCases)) * 100),
          });
        }
        if (geoRes && geoRes.length > 0) {
          setGeoCases(geoRes);
        }
      } catch (err) {
        console.error("Filter update failed:", err);
      } finally {
        setRefreshing(false);
      }
    },
    []
  );

  // Full-Screen Tactical Map HUD Mode
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

  // Standard Dashboard Grid View
  return (
    <div className="space-y-8 pb-10">
      {/* Top Action & Navigation Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="rounded-xl bg-blue-500/20 p-2.5 border border-blue-400/30">
            <Crosshair size={22} className="text-blue-300 animate-pulse" />
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

        <div className="flex items-center gap-3">
          <Link
            href="/monitoring"
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition backdrop-blur-md cursor-pointer"
          >
            <ShieldAlert size={14} className="text-cyan-300" />
            <span>Sentinel Protocols</span>
            <ArrowRight size={13} />
          </Link>

          <button
            onClick={() => setViewMode("hud")}
            className="flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-4 py-2 text-xs font-black text-slate-950 transition shadow-lg cursor-pointer shrink-0"
          >
            <Maximize2 size={14} />
            <span>Launch Tactical HUD Mode</span>
          </button>
        </div>
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
      {/* 3. Geospatial Crime Intelligence & Sentinel Fences */}
      {/* ====================================================== */}
      <section>
        <SectionHeader
          icon={<MapPinned size={20} />}
          title="Geospatial Crime Intelligence & Sentinel Fences"
          description="GIS spatial analysis, district clustering, and animated Sentinel perimeter boundaries."
          badges={[
            { label: "ArcGIS Dark Canvas", color: "blue" },
            { label: "Perimeter Geo-Fences", color: "orange" },
            { label: "Live Mapping", color: "green" },
          ]}
          open={sections.intelligence}
          onToggle={() => toggle("intelligence")}
        />

        {sections.intelligence && (
          <CrimeMap cases={geoCases} loading={loading || refreshing} onRefresh={loadData} />
        )}
      </section>

      {/* ====================================================== */}
      {/* 4. Historical Velocity & Crime Trends */}
      {/* ====================================================== */}
      <section>
        <SectionHeader
          icon={<ChartColumnIncreasing size={20} />}
          title="Crime Movement & Subhead Analytics"
          description="Temporal velocity distributions and subhead classification composition."
          badges={[
            { label: "May - Jul 2026", color: "blue" },
            { label: "18 Crime Subheads", color: "purple" },
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
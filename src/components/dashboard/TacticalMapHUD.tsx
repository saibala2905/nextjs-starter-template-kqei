"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Shield,
  BrainCircuit,
  TrendingUp,
  PieChart as PieIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Flame,
  LayoutGrid,
  Moon,
  Sun,
  Eye,
  Share2,
  X,
  Clock,
  Compass,
  ArrowRight,
  ArrowLeft,
  Crosshair,
  Radar,
  ListFilter,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  DashboardOverviewResponse,
  GeoCasePoint,
  DashboardKPISummary,
} from "@/types/apiTypes";
import { kspApi } from "@/services/kspApi";
import CaseDetailModal from "@/components/cases/CaseDetailModal";

const LeafletMap = dynamic(() => import("@/components/dashboard/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex items-center gap-3">
        <Radar size={22} className="animate-spin text-cyan-400" />
        <span className="text-xs font-mono font-bold tracking-wider text-cyan-300">
          INITIALIZING TACTICAL SATELLITE ENGINE...
        </span>
      </div>
    </div>
  ),
});

interface TacticalMapHUDProps {
  overview: DashboardOverviewResponse | null;
  geoCases: GeoCasePoint[];
  kpis: DashboardKPISummary | null;
  onExitHUD: () => void;
}

const DISTRICT_COORDINATES: Record<string, [number, number]> = {
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

const PALETTE = ["#38bdf8", "#a855f7", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#6366f1"];

export default function TacticalMapHUD({
  overview,
  geoCases: initialGeoCases,
  kpis,
  onExitHUD,
}: TacticalMapHUDProps) {
  const router = useRouter();

  // Internal cases list to guarantee data is never empty
  const [liveCases, setLiveCases] = useState<GeoCasePoint[]>(initialGeoCases || []);
  const [scanning, setScanning] = useState(false);

  // HUD Drawer state
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [leftTab, setLeftTab] = useState<"assessment" | "cases" | "alerts">("assessment");
  const [rightTab, setRightTab] = useState<"trends" | "classification">("trends");

  // Map Controls (defaults to dark, adapts to light and satellite)
  const [tileTheme, setTileTheme] = useState<"dark" | "light" | "satellite">("dark");
  const [showHotspotRings, setShowHotspotRings] = useState(true);
  const [activeDistrict, setActiveDistrict] = useState<string>("all");
  const [crimeFilter, setCrimeFilter] = useState<string>("all");
  const [flyToCenter, setFlyToCenter] = useState<[number, number] | null>(null);

  // Selected Pin / Mission Brief
  const [selectedCase, setSelectedCase] = useState<GeoCasePoint | null>(null);
  const [modalCaseId, setModalCaseId] = useState<number | null>(null);

  const isLight = tileTheme === "light";

  // Self-heal & sync cases: update state whenever initialGeoCases arrives or fetch directly
  useEffect(() => {
    if (initialGeoCases && initialGeoCases.length > 0) {
      setLiveCases(initialGeoCases);
    } else {
      kspApi.getGeoCases({ limit: 300 })
        .then((data) => {
          if (data && data.length > 0) {
            setLiveCases(data);
          }
        })
        .catch((err) => console.error("HUD geo-cases fetch error:", err));
    }
  }, [initialGeoCases]);

  // District name normalizer for robust matching
  const matchDistrictName = useCallback((caseDistrict: string, targetDistrict: string) => {
    if (targetDistrict === "all") return true;
    if (!caseDistrict) return false;
    const cClean = caseDistrict.toLowerCase().replace(/[^a-z0-9]/g, "");
    const tClean = targetDistrict.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cClean.includes(tClean) || tClean.includes(cClean);
  }, []);

  // Filtered cases for the HUD
  const filteredCases = useMemo(() => {
    return liveCases.filter((c) => {
      const matchDistrict = matchDistrictName(c.districtName, activeDistrict);
      const matchCrime =
        crimeFilter === "all"
          ? true
          : crimeFilter === "heinous"
          ? c.crime.toLowerCase().includes("murder") ||
            c.crime.toLowerCase().includes("pocso") ||
            c.crime.toLowerCase().includes("rape") ||
            c.crime.toLowerCase().includes("dacoity")
          : crimeFilter === "theft"
          ? c.crime.toLowerCase().includes("theft") ||
            c.crime.toLowerCase().includes("burglary") ||
            c.crime.toLowerCase().includes("robbery") ||
            c.crime.toLowerCase().includes("hurt")
          : crimeFilter === "cyber"
          ? c.crime.toLowerCase().includes("cyber") || c.crime.toLowerCase().includes("special")
          : c.crime.toLowerCase().includes(crimeFilter.toLowerCase());

      return matchDistrict && matchCrime;
    });
  }, [liveCases, activeDistrict, crimeFilter, matchDistrictName]);

  // Handle District Switch with Visual Scanning Pulse
  const handleDistrictChange = (dName: string) => {
    setActiveDistrict(dName);
    setScanning(true);
    setTimeout(() => setScanning(false), 1800);

    if (dName !== "all" && DISTRICT_COORDINATES[dName]) {
      setFlyToCenter(DISTRICT_COORDINATES[dName]);
    } else {
      setFlyToCenter([15.3173, 75.7139]);
    }
  };

  // Quick select an individual FIR pin
  const handleFocusPin = (c: GeoCasePoint) => {
    setSelectedCase(c);
    if (c.latitude && c.longitude) {
      setFlyToCenter([c.latitude, c.longitude]);
    }
  };

  // Find nearest Heinous case for tactical lock-on
  const handleLockOnHeinous = () => {
    const heinousCase = liveCases.find(
      (c) =>
        c.crime.toLowerCase().includes("murder") ||
        c.crime.toLowerCase().includes("pocso") ||
        c.crime.toLowerCase().includes("rape")
    );
    if (heinousCase) {
      setCrimeFilter("heinous");
      handleFocusPin(heinousCase);
    }
  };

  // Accurate dynamic FIR counts for each district
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const key of Object.keys(DISTRICT_COORDINATES)) {
      counts[key] = liveCases.filter((c) => matchDistrictName(c.districtName, key)).length;
    }
    return counts;
  }, [liveCases, matchDistrictName]);

  const trendData = overview?.crimeMovement?.map((m) => ({
    name: m.month,
    cases: m.totalCases,
  })) || [
    { name: "May 2026", cases: 499 },
    { name: "June 2026", cases: 500 },
    { name: "July 2026", cases: 500 },
  ];

  const topCategories = overview?.topCrimeCategories || [];

  return (
    <div className={`fixed inset-0 z-50 h-screen w-screen overflow-hidden font-sans select-none ${isLight ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100"}`}>
      {/* ============================================================== */}
      {/* 1. Fullscreen Map Backdrop                                     */}
      {/* ============================================================== */}
      <div className="absolute inset-0 h-full w-full z-0">
        <LeafletMap
          cases={filteredCases}
          tileTheme={tileTheme}
          showHotspotRings={showHotspotRings}
          flyToCenter={flyToCenter}
          zoomLevel={activeDistrict === "all" ? 7 : 12}
          selectedCaseId={selectedCase?.caseId}
          onSelectCase={(c) => handleFocusPin(c)}
        />
      </div>

      {/* Glassmorphic Scanning Radar Wave Banner */}
      {scanning && (
        <div className={`absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 rounded-full border px-6 py-2 text-xs font-black shadow-2xl backdrop-blur-3xl animate-pulse ${
          isLight
            ? "border-blue-500/50 bg-white/70 text-blue-900 shadow-blue-500/20"
            : "border-cyan-400/40 bg-slate-950/30 text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
        }`}>
          <Radar size={16} className={`animate-spin ${isLight ? "text-blue-600" : "text-cyan-400"}`} />
          <span className="tracking-widest uppercase">
            RADAR SWEEP: {activeDistrict} ({filteredCases.length} TARGETS ACQUIRED)
          </span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. Top Floating Ultra-Translucent Apple-Style Header           */}
      {/* ============================================================== */}
      <header className={`absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 shadow-2xl backdrop-blur-3xl transition-colors duration-300 ${
        isLight
          ? "border-white/80 bg-white/45 text-slate-900 shadow-slate-900/10"
          : "border-white/15 bg-slate-950/25 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
      }`}>
        {/* Prominent Back to Dashboard Button & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitHUD}
            className="flex items-center gap-2 rounded-xl bg-blue-600/90 hover:bg-blue-500 px-4 py-2 text-xs font-black text-white transition shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/50 backdrop-blur-md cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <div className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 border backdrop-blur-md ${
            isLight ? "border-slate-300/80 bg-white/60" : "border-white/10 bg-white/[0.05]"
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className={`text-[11px] font-black tracking-widest uppercase ${isLight ? "text-blue-700" : "text-cyan-300"}`}>
              WAR ROOM HUD
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <span className={isLight ? "text-slate-600" : "text-slate-300"}>
              TARGETS: <strong className={isLight ? "text-slate-900 font-bold" : "text-white font-bold"}>{filteredCases.length}</strong> / {kpis?.totalCases || liveCases.length}
            </span>
            <span className={isLight ? "text-slate-600" : "text-slate-300"}>
              ACTIVE: <strong className="text-amber-500 font-bold">{kpis?.activeCases || 1034}</strong>
            </span>
            <span className={isLight ? "text-slate-600" : "text-slate-300"}>
              CHARGESHEET: <strong className={isLight ? "text-blue-600 font-bold" : "text-cyan-400 font-bold"}>{kpis?.chargeSheetedCases || 295}</strong>
            </span>
            <span className={isLight ? "text-slate-600" : "text-slate-300"}>
              ZONE: <strong className={isLight ? "text-blue-700 font-bold" : "text-blue-300 font-bold"}>{activeDistrict === "all" ? "Statewide" : activeDistrict}</strong>
            </span>
          </div>
        </div>

        {/* Tactical Lock-On Quick Button */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleLockOnHeinous}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold transition shadow-md backdrop-blur-md cursor-pointer ${
              isLight
                ? "border border-red-400/80 bg-red-100/80 text-red-700 hover:bg-red-200"
                : "border border-red-500/50 bg-red-950/50 text-red-300 hover:bg-red-900/80 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            }`}
          >
            <Crosshair size={13} className="text-red-500 animate-pulse" />
            <span>Lock-On Heinous FIR</span>
          </button>
        </div>

        {/* Right Controls: Map Layer Switcher & Exit */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center rounded-xl p-1 border backdrop-blur-md ${
            isLight ? "border-slate-300/80 bg-white/60" : "border-white/10 bg-white/[0.05]"
          }`}>
            <button
              onClick={() => setTileTheme("dark")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                tileTheme === "dark"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              <Moon size={12} className="inline mr-1" /> Dark
            </button>
            <button
              onClick={() => setTileTheme("light")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                tileTheme === "light"
                  ? "bg-blue-600 text-white shadow-xs"
                  : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sun size={12} className="inline mr-1" /> Light
            </button>
            <button
              onClick={() => setTileTheme("satellite")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                tileTheme === "satellite"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass size={12} className="inline mr-1" /> Sat
            </button>
          </div>

          <button
            onClick={onExitHUD}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition backdrop-blur-md cursor-pointer border ${
              isLight
                ? "border-slate-300/80 bg-white/60 text-slate-800 hover:bg-white"
                : "border-white/15 bg-white/[0.06] text-slate-200 hover:bg-white/[0.12] hover:text-white"
            }`}
            title="Exit Tactical HUD"
          >
            <LayoutGrid size={13} />
            <span className="hidden sm:inline">Exit HUD</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. Left Floating Glassmorphic Drawer ("Threat & Targets")      */}
      {/* ============================================================== */}
      <div
        className={`absolute top-20 left-3 z-20 transition-all duration-300 ${
          leftOpen ? "w-80 md:w-96 translate-x-0" : "w-11 -translate-x-1"
        }`}
      >
        {leftOpen ? (
          <div className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-3xl flex flex-col max-h-[calc(100vh-160px)] transition-colors duration-300 ${
            isLight
              ? "border-white/80 bg-white/50 shadow-slate-900/10"
              : "border-white/15 bg-slate-950/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]"
          }`}>
            {/* Header & Tabs */}
            <div className={`flex items-center justify-between border-b p-3 ${
              isLight ? "border-slate-200/60 bg-white/40" : "border-white/10 bg-white/[0.02]"
            }`}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLeftTab("assessment")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    leftTab === "assessment"
                      ? isLight ? "bg-blue-600 text-white shadow-xs" : "bg-cyan-600 text-white shadow-xs"
                      : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Shield size={11} className="inline mr-1" /> Threat Intel
                </button>
                <button
                  onClick={() => setLeftTab("cases")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    leftTab === "cases"
                      ? isLight ? "bg-blue-600 text-white shadow-xs" : "bg-blue-600 text-white shadow-xs"
                      : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ListFilter size={11} className="inline mr-1" /> Targets ({filteredCases.length})
                </button>
                <button
                  onClick={() => setLeftTab("alerts")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    leftTab === "alerts"
                      ? "bg-purple-600 text-white shadow-xs"
                      : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <BrainCircuit size={11} className="inline mr-1" /> Alerts
                </button>
              </div>

              <button
                onClick={() => setLeftOpen(false)}
                className={`rounded-lg p-1.5 transition cursor-pointer ${
                  isLight ? "text-slate-500 hover:bg-slate-200/60" : "text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
                title="Collapse Panel"
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              {leftTab === "assessment" ? (
                <>
                  <div className={`rounded-xl border p-3 backdrop-blur-xl ${
                    isLight
                      ? "border-red-300 bg-red-50/70 text-red-900 shadow-xs"
                      : "border-red-500/40 bg-red-950/25 text-red-100"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">State Risk Index</span>
                      <span className="font-black text-base text-red-600 dark:text-red-400">78.4 / 100</span>
                    </div>
                    <p className={`mt-1 text-[11px] leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Elevated spatial clustering detected in <strong>Theft ({topCategories[1]?.count || 172})</strong> and <strong>Hurt ({topCategories[2]?.count || 166})</strong>.
                    </p>
                  </div>

                  {/* Top Districts Threat Ranking */}
                  <div className="space-y-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block flex items-center justify-between ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}>
                      <span>Target Zones &amp; Densities</span>
                      <span className={isLight ? "text-blue-600 font-mono font-bold" : "text-cyan-400 font-mono"}>{liveCases.length} Statewide FIRs</span>
                    </span>
                    {Object.keys(DISTRICT_COORDINATES).slice(0, 6).map((dName, i) => (
                      <div
                        key={dName}
                        onClick={() => handleDistrictChange(dName)}
                        className={`flex items-center justify-between rounded-xl p-2.5 border transition cursor-pointer backdrop-blur-xl ${
                          activeDistrict === dName
                            ? isLight
                              ? "bg-blue-100/80 border-blue-500 text-blue-900 font-bold shadow-xs"
                              : "bg-cyan-950/50 border-cyan-400/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            : isLight
                              ? "bg-white/40 border-slate-200/60 hover:bg-white/70 text-slate-800"
                              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 text-[10px]">#{i + 1}</span>
                          <span className="font-semibold">{dName}</span>
                        </div>
                        <span className="font-mono font-bold text-amber-500">
                          {districtCounts[dName] || 0} FIRs
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className={`pt-2 border-t ${isLight ? "border-slate-200/60" : "border-white/10"}`}>
                    <button
                      onClick={() => router.push("/interventions")}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 p-2.5 font-bold text-white text-xs flex items-center justify-center gap-1.5 transition shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Deploy Field Interventions</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </>
              ) : leftTab === "cases" ? (
                /* Interactive Zone FIR Feed */
                <div className="space-y-2 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                  <div className={`flex items-center justify-between pb-1 text-[11px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    <span>Click any case to inspect &amp; focus</span>
                    <span className={`font-bold ${isLight ? "text-blue-700" : "text-cyan-400"}`}>{filteredCases.length} cases</span>
                  </div>

                  {filteredCases.slice(0, 15).map((c) => (
                    <div
                      key={c.caseId}
                      onClick={() => handleFocusPin(c)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer backdrop-blur-xl ${
                        selectedCase?.caseId === c.caseId
                          ? isLight
                            ? "bg-blue-100 border-blue-500 shadow-xs"
                            : "bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : isLight
                            ? "bg-white/40 border-slate-200/60 hover:bg-white/70"
                            : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-[11px] truncate max-w-[170px] ${isLight ? "text-slate-900" : "text-white"}`}>{c.crime}</span>
                        <span className={`font-mono text-[10px] font-semibold ${isLight ? "text-blue-700" : "text-cyan-300"}`}>{c.crimeNo ? c.crimeNo.slice(-6) : c.caseId}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                        <span className="truncate max-w-[140px]">{c.unitName || c.districtName}</span>
                        <span className="text-amber-500 font-semibold">{c.statusName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Attention Queue Feed */
                <div className="space-y-2.5">
                  <div className={`rounded-xl border p-3 backdrop-blur-xl ${
                    isLight ? "border-amber-300 bg-amber-50/70" : "border-amber-500/30 bg-amber-950/20"
                  }`}>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">Cyber Fraud Alert</span>
                    <p className={`font-bold mt-0.5 ${isLight ? "text-slate-900" : "text-slate-200"}`}>UPI Impersonation Spike in Mysuru</p>
                    <span className={`text-[10px] mt-1 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>Requires specialized cyber cell response</span>
                  </div>

                  <div className={`rounded-xl border p-3 backdrop-blur-xl ${
                    isLight ? "border-blue-300 bg-blue-50/70" : "border-blue-500/30 bg-blue-950/20"
                  }`}>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block uppercase">Chargesheet Filed</span>
                    <p className={`font-bold mt-0.5 ${isLight ? "text-slate-900" : "text-slate-200"}`}>FIR #202600142 Trial Initiated</p>
                    <span className={`text-[10px] mt-1 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>Belagavi Sessions Court</span>
                  </div>

                  <div className={`rounded-xl border p-3 backdrop-blur-xl ${
                    isLight ? "border-purple-300 bg-purple-50/70" : "border-purple-500/30 bg-purple-950/20"
                  }`}>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">IO Caseload Review</span>
                    <p className={`font-bold mt-0.5 ${isLight ? "text-slate-900" : "text-slate-200"}`}>3 Officers with &gt;25 Active Cases</p>
                    <span className={`text-[10px] mt-1 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>Supervisory allocation recommended</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Minimized Left Tab */
          <button
            onClick={() => setLeftOpen(true)}
            className={`flex h-24 flex-col items-center justify-center rounded-r-2xl border shadow-2xl backdrop-blur-3xl transition cursor-pointer ${
              isLight
                ? "border-white/80 bg-white/60 text-blue-700 hover:bg-white"
                : "border-white/15 bg-slate-950/30 text-cyan-400 hover:bg-white/[0.08]"
            }`}
            title="Open Threat Intel"
          >
            <Shield size={16} />
            <span className="mt-2 text-[9px] font-bold uppercase rotate-90 tracking-wider">INTEL</span>
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. Right Floating Glassmorphic Drawer ("Analytics & Velocity") */}
      {/* ============================================================== */}
      <div
        className={`absolute top-20 right-3 z-20 transition-all duration-300 ${
          rightOpen ? "w-80 md:w-96 translate-x-0" : "w-11 translate-x-1"
        }`}
      >
        {rightOpen ? (
          <div className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-3xl flex flex-col max-h-[calc(100vh-160px)] transition-colors duration-300 ${
            isLight
              ? "border-white/80 bg-white/50 shadow-slate-900/10"
              : "border-white/15 bg-slate-950/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]"
          }`}>
            {/* Header & Tabs */}
            <div className={`flex items-center justify-between border-b p-3 ${
              isLight ? "border-slate-200/60 bg-white/40" : "border-white/10 bg-white/[0.02]"
            }`}>
              <button
                onClick={() => setRightOpen(false)}
                className={`rounded-lg p-1.5 transition cursor-pointer ${
                  isLight ? "text-slate-500 hover:bg-slate-200/60" : "text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
                title="Collapse Panel"
              >
                <ChevronRight size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setRightTab("trends")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    rightTab === "trends"
                      ? isLight ? "bg-blue-600 text-white shadow-xs" : "bg-cyan-600 text-white shadow-xs"
                      : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <TrendingUp size={12} className="inline mr-1" /> Velocity
                </button>
                <button
                  onClick={() => setRightTab("classification")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    rightTab === "classification"
                      ? "bg-purple-600 text-white shadow-xs"
                      : isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <PieIcon size={12} className="inline mr-1" /> Categories
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {rightTab === "trends" ? (
                <>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}>
                      Registration Velocity (Active Zone: {activeDistrict === "all" ? "Statewide" : activeDistrict})
                    </span>
                    <div className="h-44 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="hudTrendGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2e8f0" : "#334155"} vertical={false} />
                          <XAxis dataKey="name" stroke={isLight ? "#64748b" : "#94a3b8"} fontSize={10} />
                          <YAxis stroke={isLight ? "#64748b" : "#94a3b8"} fontSize={10} domain={["dataMin - 50", "dataMax + 50"]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(15, 23, 42, 0.85)",
                              borderColor: isLight ? "rgba(226, 232, 240, 0.9)" : "rgba(255, 255, 255, 0.15)",
                              borderRadius: "12px",
                              backdropFilter: "blur(16px)",
                              color: isLight ? "#0f172a" : "#f8fafc",
                              fontSize: "11px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="cases"
                            stroke="#0284c7"
                            strokeWidth={2.5}
                            fill="url(#hudTrendGradient)"
                            name="FIRs"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 gap-2 text-center pt-2 border-t ${isLight ? "border-slate-200/60" : "border-white/10"}`}>
                    <div className={`p-2.5 rounded-xl border backdrop-blur-xl ${
                      isLight ? "bg-white/60 border-slate-200/70" : "bg-white/[0.04] border-white/10"
                    }`}>
                      <span className={`text-[10px] block ${isLight ? "text-slate-500" : "text-slate-400"}`}>Active Target Rate</span>
                      <strong className={`font-mono text-sm ${isLight ? "text-blue-700" : "text-cyan-300"}`}>{filteredCases.length} Targets</strong>
                    </div>
                    <div className={`p-2.5 rounded-xl border backdrop-blur-xl ${
                      isLight ? "bg-white/60 border-slate-200/70" : "bg-white/[0.04] border-white/10"
                    }`}>
                      <span className={`text-[10px] block ${isLight ? "text-slate-500" : "text-slate-400"}`}>Active Status</span>
                      <strong className="text-amber-500 font-mono text-sm">69.0% Inv.</strong>
                    </div>
                  </div>
                </>
              ) : (
                /* Categories Donut */
                <>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}>
                    Top Crime Subhead Classifications
                  </span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topCategories}
                          dataKey="count"
                          nameKey="crimeName"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={3}
                        >
                          {topCategories.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={PALETTE[i % PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(15, 23, 42, 0.85)",
                            borderColor: isLight ? "rgba(226, 232, 240, 0.9)" : "rgba(255, 255, 255, 0.15)",
                            borderRadius: "12px",
                            backdropFilter: "blur(16px)",
                            color: isLight ? "#0f172a" : "#f8fafc",
                            fontSize: "11px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {topCategories.slice(0, 4).map((c, i) => (
                      <div key={c.crimeMinorHeadId || i} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                          />
                          <span className={`truncate max-w-[120px] ${isLight ? "text-slate-700 font-medium" : "text-slate-300"}`}>{c.crimeName}</span>
                        </div>
                        <span className={`font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>{c.count} ({c.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Minimized Right Tab */
          <button
            onClick={() => setRightOpen(true)}
            className={`flex h-24 flex-col items-center justify-center rounded-l-2xl border shadow-2xl backdrop-blur-3xl transition cursor-pointer ${
              isLight
                ? "border-white/80 bg-white/60 text-blue-700 hover:bg-white"
                : "border-white/15 bg-slate-950/30 text-cyan-400 hover:bg-white/[0.08]"
            }`}
            title="Open Analytics"
          >
            <TrendingUp size={16} />
            <span className="mt-2 text-[9px] font-bold uppercase rotate-90 tracking-wider">STATS</span>
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* 5. Tactical FIR Pin Briefing Card                             */}
      {/* ============================================================== */}
      {selectedCase && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          <div className={`overflow-hidden rounded-2xl border-2 p-4 shadow-2xl backdrop-blur-3xl ${
            isLight
              ? "border-blue-500/80 bg-white/75 text-slate-900 shadow-blue-900/10"
              : "border-cyan-400/60 bg-slate-950/35 text-white shadow-[0_0_40px_rgba(6,182,212,0.35)]"
          }`}>
            {/* Header */}
            <div className={`flex items-start justify-between border-b pb-2 mb-3 ${isLight ? "border-slate-200" : "border-white/10"}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-black text-sm ${isLight ? "text-blue-700" : "text-cyan-400"}`}>{selectedCase.crimeNo || `Case #${selectedCase.caseId}`}</span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold border backdrop-blur-md ${
                    isLight
                      ? "border-blue-300 bg-blue-100/80 text-blue-800"
                      : "border-cyan-400/40 bg-cyan-950/70 text-cyan-300"
                  }`}>
                    {selectedCase.statusName}
                  </span>
                </div>
                <h3 className={`mt-1 text-base font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>{selectedCase.crime}</h3>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className={`rounded-lg p-1 transition cursor-pointer ${isLight ? "text-slate-500 hover:bg-slate-200" : "text-slate-400 hover:bg-white/[0.08] hover:text-white"}`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Jurisdiction & Facts */}
            <div className="space-y-2 text-xs">
              <div className={`grid grid-cols-2 gap-2 ${isLight ? "text-slate-700 font-medium" : "text-slate-300"}`}>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className={isLight ? "text-blue-600 shrink-0" : "text-cyan-400 shrink-0"} />
                  <span className="truncate">{selectedCase.unitName || selectedCase.districtName || "Station Unit"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate font-mono">{selectedCase.registeredDate ? selectedCase.registeredDate.slice(0, 10) : "2026"}</span>
                </div>
              </div>

              {selectedCase.briefFacts && (
                <p className={`rounded-xl p-2.5 text-[11px] italic border line-clamp-3 backdrop-blur-md ${
                  isLight
                    ? "border-slate-200 bg-slate-50/80 text-slate-700"
                    : "border-white/10 bg-white/[0.04] text-slate-200"
                }`}>
                  &quot;{selectedCase.briefFacts}&quot;
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setModalCaseId(selectedCase.caseId)}
                  className={`flex-1 flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-white transition shadow-md cursor-pointer ${
                    isLight
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  }`}
                >
                  <Eye size={13} />
                  <span>Inspect FIR</span>
                </button>
                <button
                  onClick={() => router.push(`/intelligence/network?caseId=${selectedCase.caseId}`)}
                  className={`flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-bold border backdrop-blur-md transition cursor-pointer ${
                    isLight
                      ? "border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
                      : "border-purple-400/40 bg-purple-950/70 text-purple-300 hover:bg-purple-900"
                  }`}
                >
                  <Share2 size={13} />
                  <span>Link Graph</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. Bottom Floating Ultra-Translucent Quick-Action Dock         */}
      {/* ============================================================== */}
      <footer className={`absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 shadow-2xl backdrop-blur-3xl transition-colors duration-300 ${
        isLight
          ? "border-white/80 bg-white/45 text-slate-900 shadow-slate-900/10"
          : "border-white/15 bg-slate-950/25 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]"
      }`}>
        {/* District Quick Jump */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`font-bold uppercase tracking-wider flex items-center gap-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            <Compass size={14} className={isLight ? "text-blue-600" : "text-cyan-400"} />
            <span>Target Zone:</span>
          </span>
          <select
            value={activeDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-hidden cursor-pointer backdrop-blur-xl ${
              isLight
                ? "border-slate-300 bg-white/80 text-slate-900"
                : "border-white/15 bg-slate-950/60 text-white"
            }`}
          >
            <option value="all">Full State ({liveCases.length} FIRs)</option>
            {Object.keys(DISTRICT_COORDINATES).map((d) => (
              <option key={d} value={d}>
                {d} ({districtCounts[d] || 0} FIRs)
              </option>
            ))}
          </select>
        </div>

        {/* Crime Category Filter Chips with Dynamic Real-Time Counts */}
        <div className="hidden md:flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setCrimeFilter("all")}
            className={`rounded-lg px-2.5 py-1 font-bold transition cursor-pointer backdrop-blur-xl ${
              crimeFilter === "all"
                ? isLight
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : isLight
                  ? "bg-white/60 text-slate-700 hover:bg-white"
                  : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
            }`}
          >
            All Crimes ({filteredCases.length})
          </button>
          <button
            onClick={() => setCrimeFilter("heinous")}
            className={`rounded-lg px-2.5 py-1 font-bold transition cursor-pointer backdrop-blur-xl ${
              crimeFilter === "heinous"
                ? "bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                : isLight
                  ? "bg-white/60 text-red-700 hover:bg-red-50"
                  : "bg-white/[0.04] text-red-400 hover:bg-red-950/40"
            }`}
          >
            🔴 Heinous Only
          </button>
          <button
            onClick={() => setCrimeFilter("theft")}
            className={`rounded-lg px-2.5 py-1 font-bold transition cursor-pointer backdrop-blur-xl ${
              crimeFilter === "theft"
                ? "bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : isLight
                  ? "bg-white/60 text-amber-700 hover:bg-amber-50"
                  : "bg-white/[0.04] text-amber-400 hover:bg-amber-950/40"
            }`}
          >
            🟡 Property / Theft
          </button>
          <button
            onClick={() => setCrimeFilter("cyber")}
            className={`rounded-lg px-2.5 py-1 font-bold transition cursor-pointer backdrop-blur-xl ${
              crimeFilter === "cyber"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : isLight
                  ? "bg-white/60 text-purple-700 hover:bg-purple-50"
                  : "bg-white/[0.04] text-purple-400 hover:bg-purple-950/40"
            }`}
          >
            🟣 Cyber
          </button>
        </div>

        {/* Hotspot Radar Toggle, Action & Return Button */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowHotspotRings(!showHotspotRings)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-bold transition cursor-pointer backdrop-blur-xl ${
              showHotspotRings
                ? isLight
                  ? "border-red-400 bg-red-100/80 text-red-700"
                  : "border-red-500/50 bg-red-950/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                : isLight
                  ? "border-slate-300 bg-white/60 text-slate-700 hover:bg-white"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"
            }`}
          >
            <Flame size={13} className={showHotspotRings ? "animate-pulse text-red-500" : ""} />
            <span>Radar Rings {showHotspotRings ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() => router.push(`/interventions?targetDistrict=${encodeURIComponent(activeDistrict === "all" ? "Bengaluru city" : activeDistrict)}`)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-3.5 py-1.5 font-bold text-white transition shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Deploy Patrol</span>
            <ArrowRight size={13} />
          </button>

          <button
            onClick={onExitHUD}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-bold transition backdrop-blur-xl cursor-pointer ${
              isLight
                ? "border-slate-300 bg-white/70 text-slate-800 hover:bg-white shadow-xs"
                : "border-white/15 bg-white/[0.06] text-slate-200 hover:bg-white/[0.12] hover:text-white"
            }`}
          >
            <LayoutGrid size={13} />
            <span>Dashboard</span>
          </button>
        </div>
      </footer>

      {/* Case Details Full Modal */}
      {modalCaseId && (
        <CaseDetailModal
          caseId={modalCaseId}
          onClose={() => setModalCaseId(null)}
          onOpenGraph={(cId) => {
            setModalCaseId(null);
            router.push(`/intelligence/network?caseId=${cId}`);
          }}
        />
      )}
    </div>
  );
}

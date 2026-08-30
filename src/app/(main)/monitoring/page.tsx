"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ShieldAlert,
  Plus,
  Play,
  Pause,
  Trash2,
  BellRing,
  Activity,
  Maximize2,
  CheckCircle2,
  Compass,
  Radio,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import type { GeoCasePoint, DashboardOverviewResponse } from "@/types/apiTypes";
import { kspApi } from "@/services/kspApi";
import {
  MLMonitoringService,
  SentinelProtocol,
  AnomalyCluster,
} from "@/services/mlMonitoringService";
import ProtocolManagerModal from "@/components/monitoring/ProtocolManagerModal";
import TacticalMapHUD from "@/components/dashboard/TacticalMapHUD";

const LeafletMap = dynamic(() => import("@/components/dashboard/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex items-center gap-2">
        <Radio className="h-4 w-4 animate-spin text-cyan-400" />
        <span className="text-xs font-mono">LOADING SENTINEL GIS MATRIX...</span>
      </div>
    </div>
  ),
});

export default function SentinelMonitoringPage() {
  const [viewMode, setViewMode] = useState<"standard" | "hud">("standard");
  const [protocols, setProtocols] = useState<SentinelProtocol[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyCluster[]>([]);
  const [geoCases, setGeoCases] = useState<GeoCasePoint[]>([]);
  const [overview, setOverview] = useState<DashboardOverviewResponse | null>(null);

  const [activeTab, setActiveTab] = useState<"rules" | "matrix" | "logs">("rules");
  const [showModal, setShowModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [cases, overviewData] = await Promise.all([
        kspApi.getGeoCases({ limit: 300 }).catch(() => [] as GeoCasePoint[]),
        kspApi.getDashboardOverview().catch(() => null),
      ]);

      setGeoCases(cases);
      setOverview(overviewData);

      const stored = MLMonitoringService.getProtocols();
      const evaluated = MLMonitoringService.evaluateProtocols(stored, cases);
      setProtocols(evaluated);

      const detected = MLMonitoringService.detectAnomalies(cases);
      setAnomalies(detected);
    } catch (e) {
      console.error("Sentinel monitoring load error:", e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = (pId: string) => {
    const updated = MLMonitoringService.toggleStatus(pId);
    const evaluated = MLMonitoringService.evaluateProtocols(updated, geoCases);
    setProtocols(evaluated);
  };

  const handleDelete = (pId: string) => {
    const updated = MLMonitoringService.deleteProtocol(pId);
    const evaluated = MLMonitoringService.evaluateProtocols(updated, geoCases);
    setProtocols(evaluated);
  };

  const [selectedProtocol, setSelectedProtocol] = useState<SentinelProtocol | null>(null);

  const handleFocusProtocol = (p: SentinelProtocol) => {
    setSelectedProtocol(p);
  };

  const activeCount = protocols.filter((p) => p.status !== "paused").length;
  const breachedCount = protocols.filter((p) => p.status === "breached").length;

  if (viewMode === "hud") {
    return (
      <TacticalMapHUD
        overview={overview}
        geoCases={geoCases}
        kpis={overview?.kpis || null}
        onExitHUD={() => setViewMode("standard")}
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Sentinel Header Banner */}
      <div className="rounded-3xl border border-blue-300/40 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-cyan-500/20 p-3.5 border border-cyan-400/40 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <ShieldAlert size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                Sentinel Protocols &amp; ML Surveillance Engine
              </h1>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                Automated Security Rules
              </span>
            </div>
            <p className="text-xs md:text-sm text-blue-200/80 mt-1 max-w-2xl leading-relaxed">
              Machine learning anomaly detection, multi-district boundary surveillance, and automated police response dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-5 py-3 text-xs font-black text-slate-950 transition shadow-lg cursor-pointer"
          >
            <Plus size={16} />
            <span>Define New Protocol</span>
          </button>

          <button
            onClick={() => setViewMode("hud")}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-3 text-xs font-bold text-white transition backdrop-blur-md cursor-pointer"
          >
            <Maximize2 size={15} />
            <span>Tactical Map HUD</span>
          </button>
        </div>
      </div>

      {/* Surveillance Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Active Surveillance Rules</span>
          <span className="text-3xl font-black text-slate-900 font-mono mt-1 block">{activeCount} Rules</span>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 size={13} /> Continuous Evaluation Active
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Surge Breaches Detected</span>
          <span className={`text-3xl font-black font-mono mt-1 block ${breachedCount > 0 ? "text-red-600 animate-pulse" : "text-emerald-600"}`}>
            {breachedCount} Breaches
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            {breachedCount > 0 ? "Automated police actions triggered" : "All crime vectors within baseline"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">ML Z-Score Spikes Flagged</span>
          <span className="text-3xl font-black text-amber-600 font-mono mt-1 block">
            {anomalies.filter((a) => a.isAnomalous).length} Clusters
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Z-Score &ge; 1.8 across 38 districts
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Automated Dispatch Units</span>
          <span className="text-3xl font-black text-blue-600 font-mono mt-1 block">4 Handlers</span>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">
            Patrol &bull; Cyber &bull; Barricade &bull; SP
          </span>
        </div>
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side: Protocol Controls & Tabs (7 cols) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Workspace Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("rules")}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                  activeTab === "rules"
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <ShieldAlert size={14} className="inline mr-1.5" />
                Active Protocols ({protocols.length})
              </button>

              <button
                onClick={() => setActiveTab("matrix")}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                  activeTab === "matrix"
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Activity size={14} className="inline mr-1.5" />
                ML Anomaly Matrix ({anomalies.length})
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                  activeTab === "logs"
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <BellRing size={14} className="inline mr-1.5" />
                Dispatch Audit Logs
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <Plus size={14} />
              <span>New Rule</span>
            </button>
          </div>

          {/* Tab 1: Active Protocols */}
          {activeTab === "rules" && (
            <div className="space-y-3">
              {protocols.map((p) => {
                const isBreached = p.status === "breached";
                return (
                  <div
                    key={p.id}
                    onClick={() => handleFocusProtocol(p)}
                    className={`rounded-2xl border p-5 transition bg-white shadow-xs cursor-pointer ${
                      selectedProtocol?.id === p.id
                        ? "ring-2 ring-blue-500 border-blue-400 shadow-md"
                        : isBreached
                        ? "border-red-400 bg-red-50/40 ring-1 ring-red-400"
                        : p.status === "paused"
                        ? "border-slate-200 bg-slate-50 opacity-60"
                        : "border-slate-200 hover:border-blue-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600">{p.code}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                              isBreached
                                ? "bg-red-100 text-red-800 border border-red-300 animate-pulse"
                                : p.status === "paused"
                                ? "bg-slate-200 text-slate-700"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            }`}
                          >
                            {isBreached ? "SURGE BREACHED" : p.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {p.severity === "critical" ? "🔴 Critical" : "🟡 Elevated"}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">{p.name}</h3>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(p.id);
                          }}
                          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                            p.status === "paused"
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                          }`}
                        >
                          {p.status === "paused" ? (
                            <>
                              <Play size={12} />
                              <span>Resume</span>
                            </>
                          ) : (
                            <>
                              <Pause size={12} />
                              <span>Pause</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
                          }}
                          className="rounded-xl p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Protocol"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.description}</p>

                    {/* Progress Gauge */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Target Zone: <strong className="text-slate-800">{p.targetDistricts.join(", ")}</strong>
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {p.currentValue} / {p.threshold} {p.metricType === "incident_count" ? "FIRs" : "Z-Score"}
                        </span>
                      </div>

                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isBreached ? "bg-red-500" : p.currentValue > p.threshold * 0.7 ? "bg-amber-500" : "bg-blue-600"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.round((p.currentValue / Math.max(1, p.threshold)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        Auto-Action: {p.autoAction === "patrol_dispatch" ? "🚔 Mobile Patrol Units" : p.autoAction === "cyber_advisory" ? "⚡ Cyber Advisory" : p.autoAction === "toll_barricade" ? "🚧 Highway Barricades" : "🚨 SP Escalation"}
                      </span>

                      {isBreached ? (
                        <span className="font-bold text-red-600 text-[11px] flex items-center gap-1 animate-pulse">
                          <BellRing size={12} /> Police Unit Dispatched
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <ShieldCheck size={13} /> Perimeter Secure
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Statistical Anomaly Matrix */}
          {activeTab === "matrix" && (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">District Velocity Anomaly Detection</h4>
                  <p className="text-xs text-slate-500">Continuous Gaussian Z-score clustering ranking</p>
                </div>
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {anomalies.length} Vectors Analyzed
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                {anomalies.map((a, i) => (
                  <div key={`${a.districtName}-${a.crimeHead}-${i}`} className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{a.districtName}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">{a.crimeHead}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{a.detectedPattern}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`font-mono font-bold text-sm ${a.zScore >= 2.0 ? "text-red-600" : a.zScore >= 1.5 ? "text-amber-600" : "text-slate-700"}`}>
                        +{a.zScore.toFixed(2)} Z
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {a.currentCount} Cases (Exp: {a.expectedBaseline})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Dispatch Logs */}
          {activeTab === "logs" && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-red-300 bg-red-50/50 p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-500 p-1.5 text-white">
                      <BellRing size={13} />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Operation Night Vigil &bull; Automated Dispatch</h4>
                      <p className="text-[11px] text-red-700 mt-0.5">Threshold 15 FIRs reached in Bengaluru city &bull; Mobile Patrol 108 Dispatched</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Live</span>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-500 p-1.5 text-white">
                      <AlertTriangle size={13} />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Cyber Shield Sentinel &bull; Advisory Broadcast</h4>
                      <p className="text-[11px] text-amber-800 mt-0.5">Statistical surge (+2.4 Z) in Mysuru District &bull; Public Banking Advisory Dispatched</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">1 hr ago</span>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-600 p-1.5 text-white">
                      <CheckCircle2 size={13} />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">POCSO Rapid Response Sentinel &bull; SP Notification</h4>
                      <p className="text-[11px] text-blue-800 mt-0.5">Juvenile officer fast-track initiated for Case #202600142</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">3 hrs ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Embedded Sentinel Radar GIS Map (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-cyan-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Sentinel Geo-Fence Surveillance</h3>
              </div>
              <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-[10px] font-bold text-cyan-800">
                {protocols.filter((p) => p.status !== "paused").length} Fences Active
              </span>
            </div>

            <div className="h-[480px] w-full">
              <LeafletMap
                cases={geoCases}
                protocols={protocols}
                showHotspotRings={true}
                zoomLevel={7}
              />
            </div>

            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Nominal
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Elevated
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" /> Breached
                </span>
              </div>

              <button
                onClick={() => setViewMode("hud")}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-1.5 text-xs font-black text-slate-950 transition cursor-pointer"
              >
                <Maximize2 size={13} />
                <span>Open Full HUD</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Creator Modal */}
      {showModal && (
        <ProtocolManagerModal
          onClose={() => setShowModal(false)}
          onProtocolCreated={(newProt) => {
            const updated = [newProt, ...protocols];
            const evaluated = MLMonitoringService.evaluateProtocols(updated, geoCases);
            setProtocols(evaluated);
          }}
        />
      )}
    </div>
  );
}

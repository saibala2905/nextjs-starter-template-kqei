"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Plus,
  Play,
  Pause,
  BellRing,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import type { GeoCasePoint } from "@/types/apiTypes";
import {
  MLMonitoringService,
  SentinelProtocol,
  AnomalyCluster,
} from "@/services/mlMonitoringService";
import ProtocolManagerModal from "@/components/monitoring/ProtocolManagerModal";

interface SentinelMonitoringSectionProps {
  cases: GeoCasePoint[];
  onOpenHUD?: () => void;
}

export default function SentinelMonitoringSection({
  cases,
  onOpenHUD,
}: SentinelMonitoringSectionProps) {
  const [protocols, setProtocols] = useState<SentinelProtocol[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyCluster[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = MLMonitoringService.getProtocols();
    const evaluated = MLMonitoringService.evaluateProtocols(stored, cases);
    setProtocols(evaluated);
    const detected = MLMonitoringService.detectAnomalies(cases);
    setAnomalies(detected);
  }, [cases]);

  const handleToggle = (pId: string) => {
    const updated = MLMonitoringService.toggleStatus(pId);
    const evaluated = MLMonitoringService.evaluateProtocols(updated, cases);
    setProtocols(evaluated);
  };

  const breachedCount = protocols.filter((p) => p.status === "breached").length;
  const activeCount = protocols.filter((p) => p.status !== "paused").length;

  return (
    <div className="space-y-6">
      {/* Top Protocol Status Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-cyan-500/20 p-3 border border-cyan-400/30 text-cyan-300">
            <ShieldAlert size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">
                ML-Based Crime Sentinel &amp; Automated Rule Engine
              </h3>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                Continuous Surveillance
              </span>
            </div>
            <p className="text-xs text-blue-200/80 mt-1 max-w-2xl">
              Statistical Z-score anomaly detector evaluating active protocols against 1,499 FIR records in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-black text-slate-950 transition shadow-lg cursor-pointer"
          >
            <Plus size={15} />
            <span>Define New Sentinel Protocol</span>
          </button>

          {onOpenHUD && (
            <button
              onClick={onOpenHUD}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition backdrop-blur-md cursor-pointer"
            >
              <Maximize2 size={14} />
              <span>View on Map HUD</span>
            </button>
          )}
        </div>
      </div>

      {/* Protocol Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Active Surveillance Rules</span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">{activeCount} Rules</span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block flex items-center gap-1">
            <CheckCircle2 size={12} /> Evaluating Live ZCQL Data
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Rule Breaches Detected</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${breachedCount > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {breachedCount} Breaches
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {breachedCount > 0 ? "Threshold exceeded in active zones" : "All vectors within baseline limits"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Statistical Spikes Flagged</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
            {anomalies.filter((a) => a.isAnomalous).length} Velocity Anomalies
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Z-Score &ge; 1.8 above normal
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Automated Dispatch Actions</span>
          <span className="text-2xl font-black text-blue-600 font-mono mt-1 block">4 Available</span>
          <span className="text-[11px] text-blue-600 font-bold mt-1 block">
            Patrols &bull; Cyber &bull; Barricades &bull; SP
          </span>
        </div>
      </div>

      {/* Protocol Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {protocols.map((p) => {
          const isBreached = p.status === "breached";
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-5 transition bg-white shadow-xs ${
                isBreached
                  ? "border-red-300 bg-red-50/40 ring-1 ring-red-400"
                  : p.status === "paused"
                  ? "border-slate-200 bg-slate-50/60 opacity-70"
                  : "border-slate-200 hover:border-blue-300 hover:shadow-md"
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
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{p.name}</h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(p.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                    p.status === "paused"
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                  title={p.status === "paused" ? "Resume Protocol" : "Pause Protocol"}
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
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.description}</p>

              {/* Threshold Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Target: <strong className="text-slate-800">{p.targetDistricts.join(", ")}</strong>
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {p.currentValue} / {p.threshold} {p.metricType === "incident_count" ? "FIRs" : "Z"}
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
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

              {/* Action Badge */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  Auto-Response: {p.autoAction === "patrol_dispatch" ? "🚔 Mobile Patrol Units" : p.autoAction === "cyber_advisory" ? "⚡ Cyber Advisory" : p.autoAction === "toll_barricade" ? "🚧 Highway Barricades" : "🚨 SP Escalation"}
                </span>

                {isBreached && (
                  <span className="font-bold text-red-600 text-[11px] flex items-center gap-1">
                    <BellRing size={12} /> Action Dispatched
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Protocol Manager Modal */}
      {showModal && (
        <ProtocolManagerModal
          onClose={() => setShowModal(false)}
          onProtocolCreated={(newProt) => {
            const updated = [newProt, ...protocols];
            const evaluated = MLMonitoringService.evaluateProtocols(updated, cases);
            setProtocols(evaluated);
          }}
        />
      )}
    </div>
  );
}

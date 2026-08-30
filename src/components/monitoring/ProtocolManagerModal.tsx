"use client";

import { useState } from "react";
import {
  ShieldAlert,
  X,
  Plus,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import {
  MLMonitoringService,
  SentinelProtocol,
} from "@/services/mlMonitoringService";

interface ProtocolManagerModalProps {
  onClose: () => void;
  onProtocolCreated: (p: SentinelProtocol) => void;
}

const DISTRICT_OPTIONS = [
  "all",
  "Bengaluru city",
  "Bengaluru District",
  "Bengaluru South",
  "Mysuru District",
  "Mysuru City",
  "Belagavi Dist",
  "Belagavi City",
  "Dharwad",
  "Hubballi Dharwad City",
  "Mangalooru City",
  "Dakshina Kannada",
  "Kalaburagi",
  "Shivamogga",
  "Tumakuru",
  "Vijayapur",
  "Ballari",
  "Udupi",
  "Uttara Kannada",
  "Yadgir",
  "Chitradurga",
  "Hassan",
  "Mandya",
  "Raichur",
  "Davanagere",
  "Chikkamagaluru",
  "Chickballapura",
  "Bagalkot",
];

const CRIME_OPTIONS = [
  { label: "All Crime Subheads", value: "all" },
  { label: "Theft & Burglary (Property)", value: "Theft" },
  { label: "Murder & Homicide (Heinous)", value: "Murder" },
  { label: "Cyber & Financial Fraud", value: "Cyber" },
  { label: "Robbery & Dacoity", value: "Robbery" },
  { label: "POCSO & Juvenile Offences", value: "POCSO" },
  { label: "Hurt & Violent Assault", value: "Hurt" },
  { label: "Special & Local Laws", value: "Special" },
];

export default function ProtocolManagerModal({
  onClose,
  onProtocolCreated,
}: ProtocolManagerModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState(`PROT-${Math.floor(100 + Math.random() * 900)}`);
  const [description, setDescription] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(["Bengaluru city"]);
  const [crimeHead, setCrimeHead] = useState("Theft");
  const [metricType, setMetricType] = useState<"incident_count" | "velocity_spike">("incident_count");
  const [threshold, setThreshold] = useState(10);
  const [severity, setSeverity] = useState<"low" | "elevated" | "critical">("elevated");
  const [autoAction, setAutoAction] = useState<
    "patrol_dispatch" | "cyber_advisory" | "toll_barricade" | "supervisor_escalation"
  >("patrol_dispatch");

  const [saved, setSaved] = useState(false);

  const toggleDistrict = (d: string) => {
    if (d === "all") {
      setSelectedDistricts(["all"]);
      return;
    }
    const withoutAll = selectedDistricts.filter((x) => x !== "all");
    if (withoutAll.includes(d)) {
      const next = withoutAll.filter((x) => x !== d);
      setSelectedDistricts(next.length ? next : ["all"]);
    } else {
      setSelectedDistricts([...withoutAll, d]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProtocol = MLMonitoringService.createProtocol({
      name: name.trim(),
      code: code.trim(),
      description: description.trim() || `Automated Sentinel rule for ${crimeHead} in ${selectedDistricts.join(", ")}.`,
      targetDistricts: selectedDistricts,
      crimeHead,
      metricType,
      threshold,
      severity,
      status: "active",
      autoAction,
    });

    setSaved(true);
    setTimeout(() => {
      onProtocolCreated(newProtocol);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-slate-950/85 text-slate-100 shadow-[0_16px_48px_0_rgba(0,0,0,0.7)] backdrop-blur-3xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/20 p-2.5 border border-cyan-400/40 text-cyan-300">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">
                Define Sentinel Monitoring Protocol
              </h2>
              <p className="text-xs text-slate-400">
                Configure machine-learning rule triggers, district surveillance boundaries &amp; automated responses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
          {/* Protocol Name & Code */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Protocol Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Operation Hawk Eye"
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-white outline-hidden focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Code ID</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 font-mono text-cyan-300 outline-hidden focus:border-cyan-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Surveillance Objective / Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Automated night patrol trigger for high-density burglary sectors"
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-white outline-hidden focus:border-cyan-400 transition"
            />
          </div>

          {/* Crime Head & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Crime Vector to Monitor</label>
              <select
                value={crimeHead}
                onChange={(e) => setCrimeHead(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2 text-white outline-hidden focus:border-cyan-400 transition cursor-pointer"
              >
                {CRIME_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Escalation Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as "low" | "elevated" | "critical")}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2 text-white outline-hidden focus:border-cyan-400 transition cursor-pointer"
              >
                <option value="low">🟡 Low / Surveillance</option>
                <option value="elevated">🟠 Elevated Threat</option>
                <option value="critical">🔴 Critical Red Alert</option>
              </select>
            </div>
          </div>

          {/* Target District Selector Chips */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Target Surveillance Districts</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {selectedDistricts.includes("all") ? "Full State (38 Districts)" : `${selectedDistricts.length} Selected`}
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl border border-white/10 bg-white/[0.02]">
              {DISTRICT_OPTIONS.map((d) => {
                const isSelected = selectedDistricts.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDistrict(d)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      isSelected
                        ? "bg-cyan-600 text-white shadow-xs border border-cyan-400"
                        : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {d === "all" ? "🌐 Statewide" : d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metric Threshold Slider */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders size={14} className="text-cyan-400" />
                <span>Trigger Metric &amp; Threshold Limit</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMetricType("incident_count")}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    metricType === "incident_count" ? "bg-cyan-600 text-white" : "text-slate-400"
                  }`}
                >
                  Incident Count
                </button>
                <button
                  type="button"
                  onClick={() => setMetricType("velocity_spike")}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    metricType === "velocity_spike" ? "bg-purple-600 text-white" : "text-slate-400"
                  }`}
                >
                  Z-Score Spike
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min={metricType === "incident_count" ? 1 : 1.0}
                max={metricType === "incident_count" ? 30 : 4.0}
                step={metricType === "incident_count" ? 1 : 0.1}
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer"
              />
              <span className="w-16 text-right font-mono text-sm font-black text-cyan-300">
                {metricType === "incident_count" ? `${threshold} FIRs` : `${threshold.toFixed(1)} Z`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Protocol will automatically breach when {crimeHead} registrations exceed {threshold} {metricType === "incident_count" ? "incidents" : "standard deviations above normal"}.
            </p>
          </div>

          {/* Automated Response Action */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">Automated Police Action on Breach</label>
            <select
              value={autoAction}
              onChange={(e) =>
                setAutoAction(
                  e.target.value as "patrol_dispatch" | "cyber_advisory" | "toll_barricade" | "supervisor_escalation"
                )
              }
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2 text-white outline-hidden focus:border-cyan-400 transition cursor-pointer"
            >
              <option value="patrol_dispatch">🚔 Mobile Patrol Unit Deployment</option>
              <option value="cyber_advisory">⚡ Cyber Cell Fast-Track Advisory</option>
              <option value="toll_barricade">🚧 Highway Barricade &amp; Toll Checkpoint Alert</option>
              <option value="supervisor_escalation">🚨 Direct District SP Escalation</option>
            </select>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-5 py-2 text-xs font-extrabold text-white transition shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Protocol Active!</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>Activate Protocol</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

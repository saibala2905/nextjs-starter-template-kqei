"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  CheckCircle2,
  RefreshCw,
  Server,
  Key,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { kspApi } from "@/services/kspApi";
import { getBaseUrl } from "@/services/apiClient";

export default function SettingsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(getBaseUrl());
  const [testResult, setTestResult] = useState<{ status: string; latency: number } | null>(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Thresholds
  const [caseloadThreshold, setCaseloadThreshold] = useState(20);
  const [hotspotRadius, setHotspotRadius] = useState(5);
  const [alertSound, setAlertSound] = useState(true);

  const handleTestConnection = async () => {
    setTesting(true);
    const start = performance.now();
    try {
      const res = await kspApi.getHealth();
      const latency = Math.round(performance.now() - start);
      setTestResult({
        status: res.status || "CONNECTED",
        latency,
      });
    } catch (err: unknown) {
      const latency = Math.round(performance.now() - start);
      const errMsg = err instanceof Error ? err.message : "Error";
      setTestResult({
        status: `FAILED: ${errMsg}`,
        latency,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader
        icon={<SettingsIcon size={20} />}
        title="System Configuration &amp; Governance"
        description="Manage Zoho Catalyst Data Store endpoints, ZCQL query parameters, alert thresholds, and officer access governance."
        badges={[
          { label: "Catalyst Node24", color: "blue" },
          { label: "India DC", color: "green" },
          { label: "ZCQL Cache v1.2", color: "purple" },
        ]}
        open={true}
        onToggle={() => {}}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Catalyst Service & Data Store Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4">
              <Server size={18} className="text-blue-600" />
              <span>Catalyst Backend Function Endpoint</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Live API Base URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeEndpoint}
                    onChange={(e) => setActiveEndpoint(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-slate-800 outline-hidden text-xs"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shrink-0"
                  >
                    <RefreshCw size={13} className={testing ? "animate-spin" : ""} />
                    <span>Ping Endpoint</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`rounded-xl p-3.5 border flex items-center justify-between ${
                    testResult.status.includes("CONNECTED") || testResult.status.includes("UP")
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span className="font-bold">Service Status: {testResult.status}</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold">Latency: {testResult.latency}ms</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-400 font-medium block">Catalyst Project ID</span>
                  <span className="font-mono font-bold text-slate-800 block mt-0.5">50360000000034003</span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-400 font-medium block">Catalyst Org ID</span>
                  <span className="font-mono font-bold text-slate-800 block mt-0.5">60075494775</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Alert Thresholds */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4">
              <Bell size={18} className="text-purple-600" />
              <span>Operational Thresholds &amp; Signals</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">IO Heavy Caseload Threshold</p>
                  <p className="text-slate-500 text-[11px]">Triggers supervisor attention signal in Case Health</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={caseloadThreshold}
                    onChange={(e) => setCaseloadThreshold(Number(e.target.value))}
                    className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center font-bold text-slate-800"
                  />
                  <span className="text-slate-500 font-medium">Cases</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Hotspot Clustering Radius</p>
                  <p className="text-slate-500 text-[11px]">Spatial radius for incident density grouping</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={hotspotRadius}
                    onChange={(e) => setHotspotRadius(Number(e.target.value))}
                    className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center font-bold text-slate-800"
                  />
                  <span className="text-slate-500 font-medium">KM</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Live Attention Queue Audio Chime</p>
                  <p className="text-slate-500 text-[11px]">Audible chime when Critical Level 3 alert arrives</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertSound}
                  onChange={(e) => setAlertSound(e.target.checked)}
                  className="h-4 w-4 rounded-sm text-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security & Governance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4">
              <Shield size={18} className="text-emerald-600" />
              <span>Role-Based Access Governance</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">State Headquarters (DGP / HQ)</span>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">Full State</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">Statewide analytics, all 38 districts, predictive models</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">District Superintendent (SP / DCP)</span>
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">District Tier</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">Station unit caseload, officer assignments, intervention deploy</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Station House Officer (SHO)</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Unit Tier</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">FIR progress logs, daily station crime feed, local patrols</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4">
                <Key size={18} className="text-amber-600" />
                <span>Security &amp; Audit Logging</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All ZCQL queries, AI Copilot prompts, and intervention dispatches are logged to the <strong>AIQueryAudit</strong> table with timestamped officer credentials.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Settings Saved!
                </span>
              ) : (
                <span className="text-xs text-slate-400">v2.0 Production Stack</span>
              )}
              <button
                onClick={handleSave}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
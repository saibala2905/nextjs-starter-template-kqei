"use client";

import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  CheckCircle2,
  RefreshCw,
  Server,
  Key,
  Database,
  AlertTriangle,
  Zap,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { kspApi } from "@/services/kspApi";
import {
  getBaseUrl,
  setBaseUrl,
  DEFAULT_DATASTORE_URL,
} from "@/services/apiClient";

export default function SettingsPage() {
  const [dataEndpoint, setDataEndpoint] = useState(DEFAULT_DATASTORE_URL);

  const [testResult, setTestResult] = useState<{
    status: string;
    latency: number;
    functionName?: string;
    serviceName?: string;
    isSuccess: boolean;
  } | null>(null);

  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Thresholds
  const [caseloadThreshold, setCaseloadThreshold] = useState(20);
  const [hotspotRadius, setHotspotRadius] = useState(5);
  const [alertSound, setAlertSound] = useState(true);

  useEffect(() => {
    setDataEndpoint(getBaseUrl());
  }, []);

  const handleTestConnection = async (targetUrl?: string) => {
    const urlToTest = targetUrl || dataEndpoint;
    setTesting(true);
    setTestResult(null);
    const start = performance.now();
    try {
      const res = await kspApi.getHealth(urlToTest);
      const latency = Math.round(performance.now() - start);
      setTestResult({
        status: res.status || "CONNECTED",
        latency,
        functionName: res.function || "ksp_aio_function",
        serviceName: res.service || "KSP Crime Analytics & AI Service",
        isSuccess: res.status === "UP" || res.status === "CONNECTED",
      });
    } catch (err: unknown) {
      const latency = Math.round(performance.now() - start);
      const errMsg = err instanceof Error ? err.message : "Connection failed";
      setTestResult({
        status: `FAILED: ${errMsg}`,
        latency,
        isSuccess: false,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setBaseUrl(dataEndpoint);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader
        icon={<SettingsIcon size={20} />}
        title="System Configuration &amp; Governance"
        description="Unified Zoho Catalyst microservice configuration, Data Store ZCQL status, QuickML AI model, and security governance."
        badges={[
          { label: "ksp_aio_function", color: "blue" },
          { label: "India DC", color: "green" },
          { label: "Unified Stack v2.0", color: "purple" },
        ]}
        open={true}
        onToggle={() => {}}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Catalyst Service Endpoint & Thresholds (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Unified Microservice Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <Server size={18} className="text-blue-600" />
                <span>Unified Catalyst Microservice Endpoint</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                ZCQL + QuickML AI
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Live API Base URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dataEndpoint}
                    onChange={(e) => setDataEndpoint(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-slate-800 outline-hidden text-xs focus:border-blue-500 focus:bg-white transition"
                    placeholder="https://.../server/ksp_aio_function"
                  />
                  <button
                    onClick={() => handleTestConnection(dataEndpoint)}
                    disabled={testing}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shrink-0"
                  >
                    <RefreshCw size={13} className={testing ? "animate-spin" : ""} />
                    <span>Ping Service</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`rounded-xl p-3.5 border flex items-center justify-between ${
                    testResult.isSuccess
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult.isSuccess ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-red-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block">Status: {testResult.status}</span>
                      {testResult.functionName && (
                        <span className="text-[11px] opacity-80">
                          {testResult.serviceName} ({testResult.functionName})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold">Latency: {testResult.latency}ms</span>
                </div>
              )}

              {/* Service Capabilities Strip */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-1">
                    <Database size={14} className="text-blue-600" />
                    <span>ZCQL Data Store</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    1,499 FIR records across 38 districts, 76 police stations, and 76 IOs.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-1">
                    <Zap size={14} className="text-purple-600" />
                    <span>QuickML GenAI</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Model: <span className="font-mono font-semibold text-slate-700">crm-di-glm47b_30b_it</span> for KSP Copilot.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Alert Thresholds */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4">
              <Bell size={18} className="text-amber-600" />
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

        {/* Right: Security, IDs & Governance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4">
              <Server size={18} className="text-blue-600" />
              <span>Catalyst Project Credentials</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] text-slate-400 font-medium block">Catalyst Function Name</span>
                <span className="font-mono font-bold text-blue-700 block mt-0.5">ksp_aio_function</span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] text-slate-400 font-medium block">Catalyst Project ID</span>
                <span className="font-mono font-bold text-slate-800 block mt-0.5">50360000000034003</span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] text-slate-400 font-medium block">Catalyst Org ID</span>
                <span className="font-mono font-bold text-slate-800 block mt-0.5">60075494775</span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] text-slate-400 font-medium block">Environment</span>
                <span className="font-mono font-bold text-emerald-700 block mt-0.5">Development (India DC)</span>
              </div>
            </div>
          </div>

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
                  <CheckCircle2 size={14} /> Saved to Local Storage!
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
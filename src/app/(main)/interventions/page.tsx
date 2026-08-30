"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Target,
  Plus,
  TrendingDown,
  CheckCircle2,
  Activity,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { Suspense } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { kspApi } from "@/services/kspApi";
import type { GeoDistrict } from "@/types/apiTypes";

interface InterventionItem {
  id: string;
  title: string;
  type: "High-Visibility Patrol" | "Highway Checkpost" | "Cyber Vigilance Drive" | "Offender Surveillance";
  districtName: string;
  stationName: string;
  startDate: string;
  durationDays: number;
  preIncidentCount: number;
  postIncidentCount: number;
  reductionPercentage: number;
  status: "ACTIVE" | "COMPLETED" | "SCHEDULED";
  outcome: "EFFECTIVE" | "TARGET_EXCEEDED" | "IN_PROGRESS";
}

const initialInterventions: InterventionItem[] = [
  {
    id: "int-101",
    title: "Bengaluru East Anti-Theft Special Patrol",
    type: "High-Visibility Patrol",
    districtName: "Bengaluru city",
    stationName: "Unit 9209",
    startDate: "2026-06-01",
    durationDays: 30,
    preIncidentCount: 42,
    postIncidentCount: 29,
    reductionPercentage: 31.0,
    status: "COMPLETED",
    outcome: "TARGET_EXCEEDED",
  },
  {
    id: "int-102",
    title: "Hubballi Highway Night Checkpost Operation",
    type: "Highway Checkpost",
    districtName: "Dharwad (Hubballi)",
    stationName: "Unit 9214",
    startDate: "2026-06-15",
    durationDays: 30,
    preIncidentCount: 28,
    postIncidentCount: 21,
    reductionPercentage: 25.0,
    status: "COMPLETED",
    outcome: "EFFECTIVE",
  },
  {
    id: "int-103",
    title: "Mysuru Cyber Fraud Interception Task Force",
    type: "Cyber Vigilance Drive",
    districtName: "Mysuru city",
    stationName: "Unit 9211",
    startDate: "2026-07-01",
    durationDays: 20,
    preIncidentCount: 35,
    postIncidentCount: 26,
    reductionPercentage: 25.7,
    status: "ACTIVE",
    outcome: "IN_PROGRESS",
  },
  {
    id: "int-104",
    title: "Belagavi Repeat Offender Surveillance Sweep",
    type: "Offender Surveillance",
    districtName: "Belagavi dist",
    stationName: "Unit 9219",
    startDate: "2026-07-10",
    durationDays: 14,
    preIncidentCount: 19,
    postIncidentCount: 13,
    reductionPercentage: 31.5,
    status: "ACTIVE",
    outcome: "IN_PROGRESS",
  },
];

function InterventionsContent() {
  const searchParams = useSearchParams();
  const targetDistrictParam = searchParams.get("targetDistrict");

  const [interventions, setInterventions] = useState<InterventionItem[]>(initialInterventions);
  const [districts, setDistricts] = useState<GeoDistrict[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New intervention form
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<InterventionItem["type"]>("High-Visibility Patrol");
  const [newDistrict, setNewDistrict] = useState(targetDistrictParam || "Bengaluru city");
  const [newStation, setNewStation] = useState("Unit 9209");
  const [newDuration, setNewDuration] = useState(14);

  useEffect(() => {
    kspApi
      .getGeoDistricts()
      .then((d) => setDistricts(d || []))
      .catch((err) => console.error("Error loading districts for interventions:", err));
  }, []);

  useEffect(() => {
    if (targetDistrictParam) {
      setNewDistrict(targetDistrictParam);
      setShowCreateModal(true);
    }
  }, [targetDistrictParam]);

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: InterventionItem = {
      id: `int-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      type: newType,
      districtName: newDistrict,
      stationName: newStation,
      startDate: new Date().toISOString().slice(0, 10),
      durationDays: newDuration,
      preIncidentCount: 30,
      postIncidentCount: 22,
      reductionPercentage: 26.6,
      status: "ACTIVE",
      outcome: "IN_PROGRESS",
    };

    setInterventions([created, ...interventions]);
    setShowCreateModal(false);
    setNewTitle("");
  };

  const chartData = interventions.map((item) => ({
    name: item.title.slice(0, 18) + "...",
    "Baseline FIRs": item.preIncidentCount,
    "Post-Action FIRs": item.postIncidentCount,
  }));

  const totalActions = interventions.length;
  const activeCount = interventions.filter((i) => i.status === "ACTIVE").length;
  const avgReduction = Math.round(
    interventions.reduce((sum, i) => sum + i.reductionPercentage, 0) / (totalActions || 1)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <SectionHeader
        icon={<Target size={20} />}
        title="Preventive Interventions &amp; Action Feedback Loop"
        description="Connect identified crime hotspots to targeted field interventions and measure monitored outcomes against baseline FIRs."
        badges={[
          { label: "Closed-Loop Feedback", color: "blue" },
          { label: `${activeCount} Active Interventions`, color: "purple" },
          { label: `-${avgReduction}% Avg Incident Reduction`, color: "green" },
        ]}
        open={true}
        onToggle={() => {}}
      />

      {/* Metric Cards & Deploy Button */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Field Interventions</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-black text-blue-600">{activeCount}</p>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">Live Patrols</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Average FIR Reduction</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-black text-emerald-600">-{avgReduction}%</p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 flex items-center gap-1">
              <TrendingDown size={12} /> Measured
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Jurisdictions</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-black text-purple-600">{totalActions}</p>
            <span className="text-xs text-slate-500 font-medium">Urban &amp; Highway Hubs</span>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-600 bg-blue-600 p-5 shadow-xs text-white flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Action Dispatch</p>
            <p className="mt-1 text-sm font-semibold">Deploy New Preventive Action</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-2xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Simulate &amp; Deploy</span>
          </button>
        </div>
      </section>

      {/* 1. Closed-Loop Before vs. After Measurement Chart */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              <span>Intervention Impact: Baseline vs. Observed FIRs</span>
            </h2>
            <p className="text-xs text-slate-500">
              Measuring incident reduction post-patrol and post-checkpost deployments against pre-action baseline
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="h-3 w-3 rounded-sm bg-slate-400" />
              <span>Baseline (Pre-Intervention)</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-700">
              <span className="h-3 w-3 rounded-sm bg-emerald-500" />
              <span>Observed (Post-Intervention)</span>
            </div>
          </div>
        </div>

        <div className="h-[280px] pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="Baseline FIRs" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Post-Action FIRs" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 2. Active Interventions Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active &amp; Completed Interventions</h2>
            <p className="text-xs text-slate-500">Track status, targeted stations, and evaluated outcomes</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{interventions.length} Operations Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Operation Title</th>
                <th className="px-4 py-3">Intervention Type</th>
                <th className="px-4 py-3">Target Location</th>
                <th className="px-4 py-3 text-center">Baseline vs Observed</th>
                <th className="px-4 py-3 text-center">Reduction</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interventions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Started: {item.startDate} ({item.durationDays} Days)</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    <span className="font-medium text-slate-900 block">{item.districtName}</span>
                    <span className="text-[10px] text-slate-500">{item.stationName}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono">
                    <span className="text-slate-500">{item.preIncidentCount}</span>
                    <span className="text-slate-300 mx-1.5">→</span>
                    <strong className="text-emerald-600">{item.postIncidentCount}</strong>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-0.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <TrendingDown size={11} /> -{item.reductionPercentage}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        item.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.outcome === "TARGET_EXCEEDED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.outcome === "EFFECTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.outcome.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Deploy Intervention Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-600 p-2 text-white shadow-2xs">
                  <Target size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Configure Preventive Intervention</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Operation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru East Anti-Theft Night Drive"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Intervention Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as InterventionItem["type"])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-hidden cursor-pointer"
                  >
                    <option value="High-Visibility Patrol">High-Visibility Patrol</option>
                    <option value="Highway Checkpost">Highway Checkpost</option>
                    <option value="Cyber Vigilance Drive">Cyber Vigilance Drive</option>
                    <option value="Offender Surveillance">Offender Surveillance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target District</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-hidden cursor-pointer"
                  >
                    {districts.map((d) => (
                      <option key={d.districtId} value={d.districtName}>
                        {d.districtName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Station Unit</label>
                  <input
                    type="text"
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min={7}
                    max={90}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-hidden"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-slate-600 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>
                  The system will monitor daily FIR registration in <strong>{newDistrict}</strong> and measure outcome against baseline.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
                >
                  Deploy Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterventionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center p-12 text-slate-400">
          <span className="text-sm font-medium">Loading interventions suite...</span>
        </div>
      }
    >
      <InterventionsContent />
    </Suspense>
  );
}

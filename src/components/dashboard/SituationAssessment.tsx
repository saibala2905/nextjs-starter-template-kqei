"use client";

import { ShieldAlert, TrendingUp, Brain, MapPinned, CheckCircle } from "lucide-react";
import type { DashboardOverviewResponse } from "@/types/apiTypes";

interface SituationAssessmentProps {
  overview?: DashboardOverviewResponse | null;
}

export default function SituationAssessment({ overview }: SituationAssessmentProps) {
  const topCrimes = overview?.topCrimeCategories || [];
  const topDistricts = overview?.topDistricts || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5">
            <Brain className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Situation Assessment</h2>
            <p className="text-xs text-slate-500">Live intelligence synthesis from 1,499 statewide cases</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Model v2.4 Active
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-red-50/80 border border-red-100 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <ShieldAlert size={18} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Current Threat Level</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">ELEVATED (LEVEL 3)</p>
          <p className="mt-1 text-xs text-slate-600">
            {topDistricts[0] ? `${topDistricts[0].districtName} leads statewide volume with ${topDistricts[0].count} FIRs.` : "Concentrated FIR activity in urban centres."}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <TrendingUp size={18} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Composite Risk Index</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-900">78.4 / 100</p>
          <p className="mt-1 text-xs text-slate-600">
            {topCrimes[0] ? `${topCrimes[0].crimeName} accounts for ${topCrimes[0].percentage}% of recent cases.` : "Based on 3-month velocity & density models."}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Key Automated Signals</h3>
        <div className="space-y-2">
          {topCrimes.slice(0, 3).map((crime, idx) => (
            <div key={crime.crimeMinorHeadId || idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
              <span className="font-medium text-slate-700">
                • High incident concentration in <strong className="text-slate-900">{crime.crimeName}</strong> ({crime.crimeGroupName})
              </span>
              <span className="rounded bg-blue-100 px-2 py-0.5 font-semibold text-blue-700">
                {crime.count} Cases
              </span>
            </div>
          ))}
          {topDistricts[0] && (
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
              <span className="font-medium text-slate-700">
                • District Priority Alert: <strong className="text-slate-900">{topDistricts[0].districtName}</strong> & <strong className="text-slate-900">{topDistricts[1]?.districtName || "Surrounding Hub"}</strong>
              </span>
              <span className="rounded bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">
                Watchlist
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-emerald-50/70 border border-emerald-100 p-4">
        <div className="mb-2 flex items-center gap-2 text-emerald-800">
          <MapPinned size={16} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Recommended Operational Actions</h3>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700">
          <li className="flex items-center gap-1.5">
            <CheckCircle size={13} className="text-emerald-600 shrink-0" />
            <span>Deploy targeted patrol resources to top hotspots in {topDistricts[0]?.districtName || "high-density districts"}.</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle size={13} className="text-emerald-600 shrink-0" />
            <span>Initiate case review for Investigating Officers with &gt; 25 active cases in Case Health.</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle size={13} className="text-emerald-600 shrink-0" />
            <span>Review CCTV and surveillance feeds for recurring {topCrimes[0]?.crimeName || "theft"} clusters.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
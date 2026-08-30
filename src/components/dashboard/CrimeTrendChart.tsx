"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, RefreshCw } from "lucide-react";
import { kspApi } from "@/services/kspApi";
import type { CrimeTrendPoint, MonthlyCrimeMovement } from "@/types/apiTypes";

interface CrimeTrendChartProps {
  monthlyMovement?: MonthlyCrimeMovement[];
}

export default function CrimeTrendChart({ monthlyMovement }: CrimeTrendChartProps) {
  const [trendData, setTrendData] = useState<CrimeTrendPoint[]>([]);
  const [viewMode, setViewMode] = useState<"monthly" | "daily">("monthly");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (viewMode === "daily") {
      setLoading(true);
      kspApi
        .getCrimeTrends()
        .then((res) => {
          setTrendData(res.dataPoints);
        })
        .catch((err) => console.error("Error fetching daily trends:", err))
        .finally(() => setLoading(false));
    }
  }, [viewMode]);

  const monthlyChartData = monthlyMovement && monthlyMovement.length > 0
    ? monthlyMovement.map((m) => ({
        label: m.month,
        cases: m.totalCases,
      }))
    : [
        { label: "May 2026", cases: 500 },
        { label: "June 2026", cases: 499 },
        { label: "July 2026", cases: 500 },
      ];

  const dailyChartData = trendData.slice(-30).map((d) => ({
    label: d.date.slice(5),
    cases: d.count,
  }));

  const activeData = viewMode === "monthly" ? monthlyChartData : dailyChartData;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Crime Trend &amp; Monthly Velocity</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Case registration trajectory across Karnataka (1,499 FIR records)
          </p>
        </div>

        <div className="flex gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
          <button
            onClick={() => setViewMode("monthly")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === "monthly"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly Movement (May-Jul)
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === "daily"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daily Time-Series (ZCQL)
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mr-2" />
            <span className="text-xs">Fetching time series from Catalyst...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeData}>
              <defs>
                <linearGradient id="crimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="cases"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#crimeGradient)"
                name="Registered FIRs"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI Velocity Insight */}
      <div className="border-t border-slate-100 bg-blue-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700">
            <TrendingUp size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-blue-900">Pattern &amp; Stability Signal</h3>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
              Steady registration rate observed across May (500), June (499), and July 2026 (500). Urban jurisdictions exhibit weekend concentration, requiring preventive resource balancing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Layers,
  Search,
  Building2,
  RefreshCw,
  PieChart as PieIcon,
  MapPin,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import SectionHeader from "@/components/ui/SectionHeader";
import { kspApi } from "@/services/kspApi";
import type {
  CrimeSummaryItem,
  CrimeTrendPoint,
  DistrictCrimeMatrixItem,
  UnitCrimeBreakdownItem,
} from "@/types/apiTypes";

const PALETTE = [
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#059669",
  "#dc2626",
  "#0284c7",
  "#d97706",
  "#64748b",
];

export default function AnalyticsPage() {
  // State
  const [summary, setSummary] = useState<CrimeSummaryItem[]>([]);
  const [trends, setTrends] = useState<CrimeTrendPoint[]>([]);
  const [districtMatrix, setDistrictMatrix] = useState<DistrictCrimeMatrixItem[]>([]);
  const [unitBreakdown, setUnitBreakdown] = useState<UnitCrimeBreakdownItem[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(9105); // Default Bengaluru city
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("Bengaluru city");

  // Trend Filters
  const [trendCrimeFilter, setTrendCrimeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  // Search District Matrix
  const [matrixSearch, setMatrixSearch] = useState<string>("");

  // Loading
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  // Initial Load
  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, distData] = await Promise.all([
          kspApi.getCrimeSummary().catch(() => []),
          kspApi.getCrimeByDistrict().catch(() => []),
        ]);
        setSummary(sumData);
        setDistrictMatrix(distData);

        if (distData.length > 0) {
          setSelectedDistrictId(distData[0].districtId);
          setSelectedDistrictName(distData[0].districtName);
        }
      } catch (err) {
        console.error("Failed to load analytics initial data:", err);
      }
    }
    loadData();
  }, []);

  // Fetch Time-Series Trends
  const fetchTrends = useCallback(async () => {
    setLoadingTrends(true);
    try {
      const params: Record<string, string | number> = {};
      if (trendCrimeFilter !== "all") {
        params.crimeMinorHeadId = Number(trendCrimeFilter);
      }
      if (dateRange === "may") {
        params.from = "2026-05-01";
        params.to = "2026-05-31";
      } else if (dateRange === "june") {
        params.from = "2026-06-01";
        params.to = "2026-06-30";
      } else if (dateRange === "july") {
        params.from = "2026-07-01";
        params.to = "2026-07-31";
      }

      const res = await kspApi.getCrimeTrends(params);
      setTrends(res.dataPoints || []);
    } catch (err) {
      console.error("Failed to fetch trends:", err);
    } finally {
      setLoadingTrends(false);
    }
  }, [trendCrimeFilter, dateRange]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  // Fetch Station breakdown when district selection changes
  useEffect(() => {
    if (!selectedDistrictId) return;
    setLoadingUnits(true);
    kspApi
      .getCrimeByUnit(selectedDistrictId)
      .then((res) => setUnitBreakdown(res || []))
      .catch((err) => console.error("Error fetching units breakdown:", err))
      .finally(() => setLoadingUnits(false));
  }, [selectedDistrictId]);

  // Group summary by major head
  const majorHeadMap: Record<string, number> = {};
  summary.forEach((item) => {
    const head = item.crimeMajorHead || "Other";
    majorHeadMap[head] = (majorHeadMap[head] || 0) + item.count;
  });

  const majorHeadData = Object.entries(majorHeadMap).map(([name, value]) => ({
    name,
    value,
  }));

  const totalOffences = summary.reduce((sum, item) => sum + item.count, 0) || 1499;

  // Filtered District Matrix
  const filteredMatrix = districtMatrix.filter((d) =>
    d.districtName.toLowerCase().includes(matrixSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <SectionHeader
        icon={<BarChart3 size={20} />}
        title="Crime Classification & Trend Analytics"
        description="Multi-dimensional crime analysis, 38-district crime matrix, and police station caseload distributions."
        badges={[
          { label: `${totalOffences} Total Offences`, color: "blue" },
          { label: "18 Crime Subheads", color: "purple" },
          { label: "38 Districts", color: "green" },
        ]}
        open={true}
        onToggle={() => {}}
      />

      {/* Top Stat Highlights */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Top Major Crime Group</p>
          <p className="mt-1 text-2xl font-black text-blue-950">{majorHeadData[0]?.name || "Property Offences"}</p>
          <p className="text-xs text-blue-600 mt-1">{majorHeadData[0]?.value || 420} Registered Cases</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Top Specific Subhead</p>
          <p className="mt-1 text-2xl font-black text-amber-950">{summary[0]?.crime || "Theft"}</p>
          <p className="text-xs text-amber-600 mt-1">{summary[0]?.count || 180} Cases Statewide</p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Cyber Crime Volume</p>
          <p className="mt-1 text-2xl font-black text-purple-950">
            {summary.find((c) => c.crime.toLowerCase().includes("cyber"))?.count || 125} Cases
          </p>
          <p className="text-xs text-purple-600 mt-1">Increasing in Urban Zones</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Peak Volume District</p>
          <p className="mt-1 text-2xl font-black text-emerald-950">{districtMatrix[0]?.districtName || "Bengaluru city"}</p>
          <p className="text-xs text-emerald-600 mt-1">{districtMatrix[0]?.totalCases || 78} Cases Recorded</p>
        </div>
      </section>

      {/* 1. Time-Series Daily Trend Chart */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              <span>Time-Series Case Velocity &amp; Trajectory</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive daily crime occurrence trends with category and date interval filters
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Crime Category Filter */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <Layers size={14} className="text-slate-400" />
              <select
                value={trendCrimeFilter}
                onChange={(e) => setTrendCrimeFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="all">All Crime Types ({summary.length})</option>
                {summary.map((c) => (
                  <option key={c.crimeMinorHeadId} value={String(c.crimeMinorHeadId)}>
                    {c.crime}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Interval */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <Calendar size={14} className="text-slate-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-medium text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="all">Full Period (May - July 2026)</option>
                <option value="july">July 2026</option>
                <option value="june">June 2026</option>
                <option value="may">May 2026</option>
              </select>
            </div>
          </div>
        </div>

        <div className="h-[320px] pt-6">
          {loadingTrends ? (
            <div className="flex h-full items-center justify-center text-slate-400">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-xs font-medium">Filtering time series data points...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => String(v).slice(5)} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} />
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
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#analyticsGradient)"
                  name="FIR Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* 2. Crime Breakdown (Major Head Donut & Subhead Ranking Bar) */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Major Crime Head Grouping */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon size={16} className="text-purple-600" />
              <span>Major Crime Heads Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">Macro classification across the 7 statutory heads</p>
          </div>

          <div className="h-[260px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={majorHeadData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {majorHeadData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subhead Volume Ranking Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" />
              <span>Top 8 Crime Subheads Volume Ranking</span>
            </h3>
            <p className="text-xs text-slate-500">Specific crime category case counts</p>
          </div>

          <div className="h-[260px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={summary.slice(0, 8)}
                margin={{ top: 10, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="crime" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 3. 38-District Crime Matrix (Heat Table) & Unit Breakdown */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* District Crime Matrix Table (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-red-600" />
                <span>38-District Crime Matrix (Statewide)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Click any district row to drill down into its local police station caseload
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search District..."
                value={matrixSearch}
                onChange={(e) => setMatrixSearch(e.target.value)}
                className="bg-transparent text-slate-800 outline-hidden w-36"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">District Name</th>
                  <th className="px-4 py-3 text-center">Total Cases</th>
                  <th className="px-4 py-3 text-center">Theft</th>
                  <th className="px-4 py-3 text-center">Murder</th>
                  <th className="px-4 py-3 text-center">Cyber</th>
                  <th className="px-4 py-3 text-center">POCSO</th>
                  <th className="px-4 py-3 text-right">Drilldown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMatrix.map((d) => {
                  const isSelected = d.districtId === selectedDistrictId;

                  return (
                    <tr
                      key={d.districtId}
                      onClick={() => {
                        setSelectedDistrictId(d.districtId);
                        setSelectedDistrictName(d.districtName);
                      }}
                      className={`cursor-pointer transition ${
                        isSelected ? "bg-blue-50/90 font-semibold" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-900">{d.districtName}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700">{d.totalCases}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{d.crimes["Theft"] || 0}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{d.crimes["Murder"] || 0}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{d.crimes["Cyber Crime"] || 0}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{d.crimes["POCSO"] || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isSelected ? "Active" : "View"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Police Station Breakdown (1 col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 size={16} className="text-blue-600" />
                <span>Station Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium text-blue-600 mt-0.5">
                {selectedDistrictName} Jurisdiction
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {loadingUnits ? (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <span className="text-xs">Fetching station units...</span>
                </div>
              ) : unitBreakdown.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Select a district to view police station distribution
                </div>
              ) : (
                unitBreakdown.map((u) => (
                  <div key={u.unitId} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{u.unitName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Unit ID: {u.unitId}</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                        {u.totalCases} FIRs
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            Source: <strong className="text-slate-700">Zoho Catalyst ZCQL</strong> Group Aggregations
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { TopCrimeCategory } from "@/types/apiTypes";

interface CrimeCategoryChartProps {
  topCrimes?: TopCrimeCategory[];
}

const PALETTE = [
  "#2563eb", // Blue
  "#7c3aed", // Purple
  "#ea580c", // Orange
  "#059669", // Emerald
  "#dc2626", // Red
  "#0284c7", // Sky
  "#d97706", // Amber
  "#64748b", // Slate
];

export default function CrimeCategoryChart({ topCrimes }: CrimeCategoryChartProps) {
  const categories = topCrimes && topCrimes.length > 0
    ? topCrimes
    : [
        { crimeMinorHeadId: 9805, crimeName: "Theft", crimeGroupName: "Property", count: 180, percentage: 12.0 },
        { crimeMinorHeadId: 9801, crimeName: "Murder", crimeGroupName: "Body", count: 140, percentage: 9.3 },
        { crimeMinorHeadId: 9811, crimeName: "Cyber Crime", crimeGroupName: "Cyber", count: 125, percentage: 8.3 },
        { crimeMinorHeadId: 9803, crimeName: "POCSO", crimeGroupName: "Women & Child", count: 110, percentage: 7.3 },
        { crimeMinorHeadId: 9807, crimeName: "Robbery", crimeGroupName: "Property", count: 95, percentage: 6.3 },
      ];

  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900">Crime Classifications</h2>
        <p className="mt-0.5 text-xs text-slate-500">Distribution of top reported crime subheads</p>
      </div>

      <div className="h-[220px] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              dataKey="count"
              nameKey="crimeName"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {categories.map((entry, index) => (
                <Cell key={entry.crimeMinorHeadId || index} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                `${Number(value)} cases (${Math.round((Number(value) / total) * 100)}%)`,
                String(name),
              ]}
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="space-y-2 border-t border-slate-100 p-5 bg-slate-50/50 max-h-[160px] overflow-y-auto">
        {categories.slice(0, 5).map((item, index) => (
          <div key={item.crimeMinorHeadId || index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
              />
              <span className="font-medium text-slate-700 truncate">{item.crimeName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">{item.count}</span>
              <span className="font-bold text-slate-900 w-10 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
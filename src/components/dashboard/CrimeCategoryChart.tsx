"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { categoryData } from "@/data/categoryData";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#9333ea",
  "#64748b",
];

export default function CrimeCategoryChart() {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <h2 className="text-xl font-semibold">
          Crime Categories
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of reported crimes
        </p>

      </div>

      <div className="h-[320px] p-4">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={4}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Legend */}

      <div className="space-y-3 border-t p-6">

        {categoryData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">

              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span className="text-sm">
                {item.name}
              </span>

            </div>

            <span className="font-semibold">
              {item.value}%
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}
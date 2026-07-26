"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { TrendingUp } from "lucide-react";
import { crimeTrendData } from "@/data/crimeTrend";

const filters = ["7D", "30D", "90D", "YTD"];

export default function CrimeTrendChart() {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b p-6">

        <div>
          <h2 className="text-xl font-semibold">
            Crime Trend Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Daily crime trend across Karnataka
          </p>
        </div>

        <div className="flex gap-2">

          {filters.map((item) => (
            <button
              key={item}
              className={`rounded-lg px-3 py-1 text-sm transition
              ${
                item === "7D"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}

        </div>
      </div>

      {/* Chart */}

      <div className="h-[360px] p-6">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={crimeTrendData}>

            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="theft"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              name="Vehicle Theft"
            />

            <Line
              type="monotone"
              dataKey="cyber"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
              name="Cyber Crime"
            />

            <Line
              type="monotone"
              dataKey="assault"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
              name="Assault"
            />

            <Line
              type="monotone"
              dataKey="fraud"
              stroke="#9333ea"
              strokeWidth={3}
              dot={false}
              name="Financial Fraud"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* AI Insight */}

      <div className="border-t bg-blue-50 p-5">

        <div className="flex gap-3">

          <TrendingUp className="mt-1 h-5 w-5 text-blue-600" />

          <div>

            <h3 className="font-semibold text-blue-700">
              AI Insight
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Vehicle theft incidents have increased during weekends,
              while cyber crime complaints show a consistent upward
              trend throughout the week. Bengaluru Urban and Mysuru
              contribute most to the observed increase.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}